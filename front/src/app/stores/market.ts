import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { IAccountInfo } from 'app/api';
import { ISendFormValues, IAccountItemView } from './types';
import { OnlineStore, IErrorProcessor } from './online-store';
const { catchErrors } = OnlineStore;
import { RootStore } from './';
// import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { ILocalizator } from 'app/localization';

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
        super({
            errorProcessor: services.errorProcessor,
            localizator: services.localizator,
        });

        this.rootStore = rootStore;

        this.services = { ...services };
    }

    @observable
    private userInput: IMarketStoreForm = {
        marketAccountAddress: '',
    };

    @observable public marketBalance: string = '- - -';

    @catchErrors({ restart: true })
    @asyncAction
    public *updatePublicBalance() {
        const balance = yield this.services.api.fetchMarketBalance(
            this.marketAccountAddress,
        );

        this.marketBalance = balance;
    }

    @action
    public setMarketAccountAddress(address: string) {
        this.userInput.marketAccountAddress = address;
    }

    @computed
    public get marketAccountView(): IAccountItemView {
        return this.rootStore.mainStore.transformAccountInfoToView(
            this.rootStore.mainStore.accountMap.get(
                this.marketAccountAddress,
            ) as IAccountInfo,
        );
    }

    @computed
    public get marketAccountAddress(): string {
        return this.userInput.marketAccountAddress === ''
            ? this.accountList[0].address
            : this.userInput.marketAccountAddress;
    }

    @computed
    public get accountList(): IAccountItemView[] {
        return this.rootStore.mainStore.accountList;
    }
}

export default MarketStore;

export * from './types';
