import { observable, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { ISendFormValues } from './types';
import { OnlineStore, IErrorProcessor } from './online-store';
const { catchErrors } = OnlineStore;
import { RootStore } from './';
import { ILocalizator } from 'app/localization';
import { IMarketStats, IKycValidator } from 'app/api/types';

const emptyForm: ISendFormValues = {
    fromAddress: '',
    toAddress: '',
    currencyAddress: '',
    amountEther: '',
    gasLimit: '',
    gasPriceGwei: '',
    password: '',
};
Object.freeze(emptyForm);

export interface IMarketStoreApi {
    fetchMarketBalance(addr: string): Promise<string>;
    fetchMarketStats(addr: string): Promise<IMarketStats>;
    fetchValidators(): Promise<IKycValidator[]>;
}

export interface IMarketStoreServices {
    localizator: ILocalizator;
    errorProcessor: IErrorProcessor;
    api: IMarketStoreApi;
}

export interface IMarketStoreForm {
    marketAccountAddress: string;
}

export class MarketStore extends OnlineStore {
    protected rootStore: RootStore;

    public services: IMarketStoreServices;

    constructor(rootStore: RootStore, services: IMarketStoreServices) {
        super(services);
        this.rootStore = rootStore;
        this.services = { ...services };

        this.updateValidators();
    }

    @observable protected marketValidators: IKycValidator[] = [];

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

export default MarketStore;

export * from './types';
