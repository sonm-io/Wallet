import { observable, computed, action } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { updateUserInput } from './utils/update-user-input';
import { asyncAction } from 'mobx-utils';
import { AlertType } from './types';
import { IOrderParams } from 'app/api/types';
import { RootStore } from './';

export interface IOrderDetailsInput {
    password: string;
    orderId: string;
}

export interface IOrderDetailsStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IOrderDetailsStoreApi;
}

export interface IOrderDetailsStoreApi {
    quickBuy: (accountAddress: string, password: string, orderId: string) => {};
    waitForDeal: (
        accountAddress: string,
        id: string,
        delay: number,
        retries: number,
    ) => Promise<IOrderParams>;
}

export interface IOrderDetailsStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

const ORDER_CHECK_RETRY_COUNT = 30;
const ORDER_CHECK_DELAY = 1000;

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
    }

    @observable
    public userInput: IOrderDetailsInput = {
        password: '',
        orderId: '',
    };

    @observable
    public serverValidation: { [K in keyof IOrderDetailsInput]: string } = {
        password: '',
        orderId: '',
    };

    @action.bound
    public updateUserInput(values: Partial<IOrderDetailsInput>) {
        updateUserInput<IOrderDetailsInput>(this, values);
        this.serverValidation.password = '';
    }

    @pending
    @asyncAction
    public *submit() {
        const password = this.password;
        const id = this.orderId;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { data, validation } = yield this.api.quickBuy(
            accountAddress,
            password,
            id,
        );

        if (validation && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );
        } else {
            let alert;

            console.log(data);

            if (data.status === '0x0') {
                alert = {
                    type: AlertType.error,
                    message: this.localizator.getMessageText([
                        'tx_buy_order_failed',
                        [id, data.transactionHash],
                    ]),
                };
            } else {
                alert = {
                    type: AlertType.warning,
                    message: this.localizator.getMessageText([
                        'tx_buy_order_matching',
                        [id, data.transactionHash],
                    ]),
                };
            }

            this.serverValidation.password = '';
            const alertId = this.rootStore.uiStore.addAlert(alert);

            if (alert.type === AlertType.warning) {
                this.api
                    .waitForDeal(
                        accountAddress,
                        id,
                        ORDER_CHECK_RETRY_COUNT,
                        ORDER_CHECK_DELAY,
                    )
                    .then((orderParams: IOrderParams) => {
                        if (orderParams && orderParams.dealID !== '0') {
                            alert = {
                                type: AlertType.success,
                                message: this.localizator.getMessageText([
                                    'tx_buy_order_matched',
                                    [id, orderParams.dealID],
                                ]),
                            };
                        } else {
                            alert = {
                                type: AlertType.error,
                                message: this.localizator.getMessageText([
                                    'tx_buy_order_match_failed',
                                    [id],
                                ]),
                            };
                        }

                        this.rootStore.uiStore.closeAlert(alertId);
                        this.rootStore.uiStore.addAlert(alert);
                    })
                    .catch((err: Error) => {
                        alert = {
                            type: AlertType.error,
                            message: this.localizator.getMessageText([
                                'tx_buy_order_match_failed',
                                [id],
                            ]),
                        };

                        this.rootStore.uiStore.closeAlert(alertId);
                        this.rootStore.uiStore.addAlert(alert);
                    });
            }
        }
    }

    @computed
    public get orderId() {
        return this.userInput.orderId || '';
    }

    @computed
    public get password() {
        return this.userInput.password || '';
    }

    @computed
    public get validationPassword() {
        return this.serverValidation.password || '';
    }
}

export default OrderDetails;
