import { observable, computed, action } from 'mobx';
import { OnlineStore, IErrorProcessor } from './online-store';
import { ILocalizator } from 'app/localization';
const { pending } = OnlineStore;
import { updateUserInput } from './utils/update-user-input';
import { asyncAction } from 'mobx-utils';
import { RootStore } from './';

export interface IKYCInput {
    password: string;
    kycAddress: string;
    fee: string;
}

export interface IKYCStoreServices {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: IKYCStoreApi;
}

export interface IKYCStoreApi {
    getLink: (
        accountAddress: string,
        password: string,
        kycAddress: string,
        fee: string,
    ) => {};
}

export interface IKYCStoreExternal {
    market: {
        marketAccountAddress: string;
    };
}

export class KYC extends OnlineStore implements IKYCInput {
    protected rootStore: RootStore;
    protected externalStores: IKYCStoreExternal;
    protected api: IKYCStoreApi;
    protected localizator: ILocalizator;
    protected errorProcessor: IErrorProcessor;
    protected link = '';

    constructor(
        rootStore: RootStore,
        externalStores: IKYCStoreExternal,
        params: IKYCStoreServices,
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
        this.link = '';
    }

    @observable
    public userInput: IKYCInput = {
        password: '',
        fee: '',
        kycAddress: '',
    };

    @observable
    public serverValidation: IKYCInput = {
        password: '',
        fee: '',
        kycAddress: '',
    };

    @action.bound
    public updateUserInput(values: Partial<IKYCInput>) {
        updateUserInput<IKYCInput>(this, values);
        this.serverValidation.password = '';
    }

    @pending
    @asyncAction
    public *submit() {
        const password = this.password;
        const kycAddress = this.kycAddress;
        const fee = this.fee;
        const accountAddress = this.externalStores.market.marketAccountAddress;

        const { data, validation } = yield this.api.getLink(
            accountAddress,
            password,
            kycAddress,
            fee,
        );

        if (validation && validation.password) {
            this.serverValidation.password = this.services.localizator.getMessageText(
                validation.password,
            );
        } else {
            this.link = data;
            console.log(data);

            this.serverValidation.password = '';
            //this.rootStore.uiStore.addAlert(alert);
        }
    }

    @computed
    public get fee() {
        return this.userInput.fee || '';
    }

    @computed
    public get password() {
        return this.userInput.password || '';
    }

    @computed
    public get kycAddress() {
        return this.userInput.kycAddress || '';
    }

    @computed
    public get validationPassword() {
        return this.serverValidation.password || '';
    }

    @computed
    public get kycLink() {
        return this.link || '';
    }
}

export default KYC;
