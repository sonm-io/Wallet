import { observable, computed, action, autorun } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending, catchErrors } = OnlineStore;
import { updateUserInput } from './utils/update-user-input';
import { asyncAction } from 'mobx-utils';
import { AlertType } from './types';
import { RootStore } from './';
import {
    IOrderParams,
    EnumOrderStatus,
    EnumProfileStatus,
    IOrder,
    EnumOrderSide,
} from 'app/api/types';
import { createBigNumber, BN } from '../utils/create-big-number';

const SECS_IN_HOUR = new BN('3600');
const SECS_IN_DAY = SECS_IN_HOUR.mul(new BN('24'));

export interface IOrderDetailsInput {
    password: string;
}

export interface IOrderDetailsStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IOrderDetailsStoreApi;
}

export interface IOrderDetailsStoreApi {
    fetchById: (id: string) => Promise<IOrder>;
    quickBuy: (
        accountAddress: string,
        password: string,
        orderId: string,
        duration: number,
    ) => {};
    waitForDeal: (accountAddress: string, id: string) => Promise<IOrderParams>;
}

export interface IOrderDetailsStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

export class OrderDetails extends OnlineStore implements IOrderDetailsInput {
    protected rootStore: RootStore;
    protected externalStores: IOrderDetailsStoreExternal;
    protected api: IOrderDetailsStoreApi;
    protected localizator: ILocalizator;
    protected errorProcessor: IErrorProcessor;

    constructor(
        rootStore: RootStore,
        externalStores: IOrderDetailsStoreExternal,
        params: IOrderDetailsStoreServices,
    ) {
        super({
            localizator: params.localizator,
            errorProcessor: params.errorProcessor,
        });

        this.externalStores = externalStores;
        this.api = params.api;
        this.localizator = params.localizator;
        this.errorProcessor = params.errorProcessor;
        this.rootStore = rootStore;

        autorun(() => {
            if (this.orderId !== '') {
                this.fetchData();
            }
        });
    }

    @observable
    public userInput: IOrderDetailsInput = {
        password: '',
    };

    @observable
    public serverValidation: { [K in keyof IOrderDetailsInput]: string } = {
        password: '',
    };

    @observable.ref public order: IOrder = OrderDetails.emptyOrder;

    @action.bound
    public updateUserInput(values: Partial<IOrderDetailsInput>) {
        updateUserInput<IOrderDetailsInput>(this, values);
        this.serverValidation.password = '';
    }

    protected showProcessingSuccess(
        orderId: string,
        transactionHash: string,
    ): string {
        return this.rootStore.uiStore.addAlert({
            type: AlertType.warning,
            message: this.localizator.getMessageText([
                'tx_buy_order_matching',
                [orderId, transactionHash],
            ]),
        });
    }

    protected showDealSuccess(orderId: string, dealId: string) {
        return this.rootStore.uiStore.addAlert({
            type: AlertType.success,
            message: this.localizator.getMessageText([
                'tx_buy_order_matched',
                [orderId, dealId],
            ]),
        });
    }

    protected showFail(orderId: string) {
        return this.rootStore.uiStore.addAlert({
            type: AlertType.error,
            message: this.localizator.getMessageText([
                'tx_buy_order_match_failed',
                [orderId],
            ]),
        });
    }

    protected resetServerValidation() {
        this.serverValidation.password = '';
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *submit() {
        const password = this.password;
        const orderId = this.orderId;
        const duration = this.duration;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { data, validation } = yield this.api.quickBuy(
            accountAddress,
            password,
            orderId,
            duration,
        );

        if (validation !== undefined && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );
        } else {
            if (data.status !== '0x0') {
                const alertId = this.showProcessingSuccess(
                    orderId,
                    data.transactionHash,
                );

                yield this.waitForDeal(accountAddress, orderId);

                this.rootStore.uiStore.closeAlert(alertId);
            } else {
                this.showFail(orderId);
            }
        }
    }

    @catchErrors({ restart: true })
    @asyncAction
    protected *waitForDeal(accountAddress: string, orderId: string) {
        const dealResult: IOrderParams = yield this.api.waitForDeal(
            accountAddress,
            orderId,
        );

        this.showDealSuccess(orderId, dealResult.dealID);
    }

    @observable public orderId: string = '';
    @observable public duration: number = 0;

    @action.bound
    public setOrderId(orderId: string) {
        this.orderId = orderId;
    }

    @action.bound
    public setDuration(duration: number) {
        this.duration = duration;
    }

    @computed
    public get password() {
        return this.userInput.password;
    }

    @computed
    public get validationPassword() {
        return this.serverValidation.password;
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    protected *fetchData() {
        this.order = yield this.api.fetchById(this.orderId);
        this.setDuration(this.order.durationSeconds);
    }

    @computed
    public get usdWeiPerHour(): string {
        let result = '';

        const price = createBigNumber(this.order.usdWeiPerSeconds);

        if (price !== undefined) {
            result = price.mul(SECS_IN_HOUR).toString();
        }

        return result;
    }

    @computed
    public get isBuyingAvailable() {
        let result = false;

        const price = new BN(this.order.usdWeiPerSeconds);
        const duration = new BN(String(this.order.durationSeconds));

        if (price !== undefined && duration !== undefined) {
            const balance =
                this.rootStore.marketStore.marketAccountView === undefined
                    ? undefined
                    : new BN(
                          this.rootStore.marketStore.marketAccountView.usdBalance,
                      );

            if (balance !== undefined) {
                if (this.order.durationSeconds !== 0) {
                    const cost = duration.gt(SECS_IN_DAY)
                        ? price.mul(SECS_IN_DAY)
                        : price.mul(duration);

                    result = balance.gte(cost);
                } else {
                    const perHour = price.mul(SECS_IN_HOUR);

                    result = balance.gte(perHour);
                }
            }
        }

        return result;
    }

    public static emptyOrder: IOrder = {
        id: '0',
        orderSide: EnumOrderSide.any,
        creator: {
            address: '0x1234567890123456789012345678901234567890',
            status: EnumProfileStatus.anon,
        },
        usdWeiPerSeconds: '1',
        durationSeconds: 0,
        orderStatus: EnumOrderStatus.active,
        benchmarkMap: {},
    };
}

export default OrderDetails;
