import { observable, computed, action } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { updateUserInput } from './utils/update-user-input';
import { asyncAction } from 'mobx-utils';

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
}

export interface IOrderDetailsStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

export class OrderDetails extends OnlineStore implements IOrderDetailsInput {
    protected externalStores: IOrderDetailsStoreExternal;
    protected api: IOrderDetailsStoreApi;

    constructor(
        externalStores: IOrderDetailsStoreExternal,
        params: IOrderDetailsStoreServices,
    ) {
        super({
            localizator: params.localizator,
            errorProcessor: params.errorProcessor,
        });

        this.externalStores = externalStores;
        this.api = params.api;
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

        const { validation } = yield this.api.quickBuy(
            accountAddress,
            password,
            id,
        );

        if (validation && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );
        } else {
            this.serverValidation.password = '';
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
