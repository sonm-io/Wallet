import { observable, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IErrorProcessor } from './online-store';
const { catchErrors } = OnlineStore;
import { RootStore } from './';
import { ILocalizator } from 'app/localization';
import { IKycValidator } from 'app/api/types';

export interface IValidatorsStoreApi {
    fetchValidators(): Promise<IKycValidator[]>;
}

export interface IValidatorsStoreServices {
    localizator: ILocalizator;
    errorProcessor: IErrorProcessor;
    api: IValidatorsStoreApi;
}

export class ValidatorsStore extends OnlineStore {
    protected rootStore: RootStore;
    protected services: IValidatorsStoreServices;

    constructor(rootStore: RootStore, services: IValidatorsStoreServices) {
        super(services);
        this.rootStore = rootStore;
        this.services = { ...services };

        this.updateValidators();
    }

    @observable
    protected marketValidators: IKycValidator[] = [];

    @catchErrors({ restart: true })
    @asyncAction
    public *updateValidators() {
        this.marketValidators = yield this.services.api.fetchValidators();
    }

    @computed
    public get validators(): IKycValidator[] {
        return this.marketValidators;
    }
}

export default ValidatorsStore;

export * from './types';
