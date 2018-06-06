import { observable, computed, action, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { ISendFormValues, IAccountItemView } from './types';
import { OnlineStore, IErrorProcessor } from './online-store';
const { catchErrors } = OnlineStore;
import { RootStore } from './';
// import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { ILocalizator } from 'app/localization';
import { IMarketStats, IValidator } from 'app/api/types';

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
    fetchValidators(): Promise<IValidator[]>;
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

        autorun(() => {
            if (
                this.userInput.marketAccountAddress === '' &&
                this.marketAccountViewList.length > 0
            ) {
                this.setMarketAccountAddress(
                    this.marketAccountViewList[0].address,
                );
            }

            this.updateValidators();
        });
    }

    @observable
    private userInput: IMarketStoreForm = {
        marketAccountAddress: '',
    };

    @observable public marketBalance: string = '- - -';
    @observable
    public marketStats: IMarketStats = {
        dealsCount: 0,
        dealsPrice: '0',
        daysLeft: 0,
    };
    @observable public marketValidators: IValidator[] = [];

    @catchErrors({ restart: true })
    @asyncAction
    public *updatePublicBalance() {
        const balance = yield this.services.api.fetchMarketBalance(
            this.marketAccountAddress,
        );

        this.marketBalance = balance;
    }

    @catchErrors({ restart: true })
    @asyncAction
    public *updateMarketStats() {
        this.marketStats = yield this.services.api.fetchMarketStats(
            this.marketAccountAddress,
        );
    }

    @catchErrors({ restart: true })
    @asyncAction
    public *updateValidators() {
        this.marketValidators = yield this.services.api.fetchValidators();
    }

    @action
    public setMarketAccountAddress(address: string) {
        this.userInput.marketAccountAddress = address;
        this.updatePublicBalance();
        this.updateMarketStats();
    }

    @computed
    public get marketAccountView(): IAccountItemView | undefined {
        let result;

        const account = this.rootStore.mainStore.accountMap.get(
            this.marketAccountAddress,
        );

        if (account) {
            result = this.rootStore.mainStore.transformAccountInfoToView(
                account,
            );
        }

        return result;
    }

    @computed
    public get marketAccountAddress(): string {
        if (
            this.userInput.marketAccountAddress === '' &&
            this.marketAccountViewList.length > 0
        ) {
            return this.marketAccountViewList[0].address;
        }

        return this.userInput.marketAccountAddress;
    }

    @computed
    public get marketAccountViewList(): IAccountItemView[] {
        return this.rootStore.mainStore.accountList;
    }

    @computed
    public get validators(): IValidator[] {
        return this.marketValidators;
    }
}

export default MarketStore;

export * from './types';
