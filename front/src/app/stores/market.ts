import { observable, computed, action, reaction } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { ISendFormValues, IAccountItemView } from './types';
import { OnlineStore, IErrorProcessor } from './online-store';
const { catchErrors } = OnlineStore;
import { RootStore } from './';
// import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { ILocalizator } from 'app/localization';
import { IMarketStats, IKycValidator } from 'app/api/types';
import { BN } from 'bn.js';

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
        super({
            errorProcessor: services.errorProcessor,
            localizator: services.localizator,
        });

        this.rootStore = rootStore;

        this.services = { ...services };

        reaction(() => this.marketAccountViewList.length, this.update, {
            fireImmediately: true,
            name: 'reaction marketAccountViewList',
        });
        reaction(() => this.userInput.marketAccountAddress, this.update, {
            name: 'reaction marketAccountAddress',
        });
        this.updateValidators();
    }

    protected update = () => {
        if (
            this.userInput.marketAccountAddress === '' &&
            this.marketAccountViewList.length > 0
        ) {
            this.setMarketAccountAddress(this.marketAccountViewList[0].address);
        }
        this.updateTotalBalance();
    };

    @observable
    private userInput: IMarketStoreForm = {
        marketAccountAddress: '',
    };

    @observable public marketBalance: string = '';
    @observable
    public marketStats: IMarketStats = {
        dealsCount: 0,
        dealsPrice: '0',
        daysLeft: 0,
    };

    @observable public marketValidators: IKycValidator[] = [];
    @observable public marketAllBalance: string = '0';

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
    public *updateTotalBalance() {
        let balance = new BN(0);
        for (const account of this.marketAccountViewList) {
            const accountBalance = yield this.services.api.fetchMarketBalance(
                account.address,
            );
            balance = balance.add(new BN(accountBalance));
        }

        this.marketAllBalance = balance.toString(10);
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

        const account = this.rootStore.myProfilesStore.getItem(
            this.marketAccountAddress,
        );

        if (account) {
            result = this.rootStore.myProfilesStore.transformAccountInfoToView(
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
        return this.rootStore.myProfilesStore.accountList;
    }

    @computed
    public get validators(): IKycValidator[] {
        return this.marketValidators;
    }
}

export default MarketStore;

export * from './types';
