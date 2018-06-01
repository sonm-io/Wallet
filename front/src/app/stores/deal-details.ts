import { observable, computed, action } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { updateUserInput } from './utils/update-user-input';
import { asyncAction } from 'mobx-utils';
import { AlertType } from './types';
import { EnumTransactionStatus } from 'app/api/types';
import { RootStore } from './';

export interface IDealDetailsInput {
    password: string;
    dealId: string;
}

export interface IDealDetailsStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IDealDetailsStoreApi;
}

export interface IDealDetailsStoreApi {
    close: (accountAddress: string, password: string, dealId: string) => {};
}

export interface IDealDetailsStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

export class DealDetails extends OnlineStore implements IDealDetailsInput {
    protected rootStore: RootStore;
    protected externalStores: IDealDetailsStoreExternal;
    protected api: IDealDetailsStoreApi;
    protected localizator: ILocalizator;
    protected errorProcessor: IErrorProcessor;

    constructor(
        rootStore: RootStore,
        externalStores: IDealDetailsStoreExternal,
        params: IDealDetailsStoreServices,
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
    public userInput: IDealDetailsInput = {
        password: '',
        dealId: '',
    };

    @observable
    public serverValidation: { [K in keyof IDealDetailsInput]: string } = {
        password: '',
        dealId: '',
    };

    @action.bound
    public updateUserInput(values: Partial<IDealDetailsInput>) {
        updateUserInput<IDealDetailsInput>(this, values);
        this.serverValidation.password = '';
    }

    @pending
    @asyncAction
    public *submit() {
        const password = this.password;
        const id = this.dealId;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { data, validation } = yield this.api.close(
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

            if (data.status === EnumTransactionStatus.fail) {
                alert = {
                    type: AlertType.error,
                    message: this.localizator.getMessageText([
                        'deal_finish_failed',
                        [id, data.transactionHash],
                    ]),
                };
            } else {
                alert = {
                    type: AlertType.success,
                    message: this.localizator.getMessageText([
                        'deal_finish_success',
                        [id, data.transactionHash],
                    ]),
                };
            }

            this.serverValidation.password = '';
            this.rootStore.uiStore.addAlert(alert);
        }
    }

    @computed
    public get dealId() {
        return this.userInput.dealId || '';
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

export default DealDetails;
