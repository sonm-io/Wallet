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
    EnumOrderType,
} from 'app/api/types';
import { Api } from 'app/api/';

export interface IOrderDetailsInput {
    password: string;
}

export interface IOrderDetailsStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IOrderDetailsStoreApi;
}

export interface IOrderDetailsStoreApi {
    quickBuy: (accountAddress: string, password: string, orderId: string) => {};
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
                'tx_buy_order_matched_failed',
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
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { data, validation } = yield this.api.quickBuy(
            accountAddress,
            password,
            orderId,
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

    @action.bound
    public setOrderId(orderId: string) {
        this.orderId = orderId;
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
        this.order = yield Api.order.fetchById(this.orderId);
    }

    public static emptyOrder: IOrder = {
        id: '0',
        orderType: EnumOrderType.any,
        creator: {
            address: '0x1234567890123456789012345678901234567890',
            status: EnumProfileStatus.anon,
        },
        price: '1',
        duration: 0,
        orderStatus: EnumOrderStatus.active,
        benchmarkMap: {},
    };
}

export default OrderDetails;
