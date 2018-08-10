import * as sortBy from 'lodash/fp/sortBy';
import { updateAddressMap } from './utils/update-address-map';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { observable, computed, action, reaction, IReactionPublic } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { IAccountItemView } from 'app/stores/types';
import Api, { IMarketStats } from 'app/api';
import { IValidation } from 'app/localization/types';
import { RootStore } from 'app/stores';
import { IAccountInfo, IProfileFull, emptyProfile } from 'app/entities/account';
const { pending, catchErrors } = OnlineStore;
import { createBigNumber, ZERO, BN } from '../utils/create-big-number';
import { ICurrencyInfo } from 'app/entities/currency';
import ProfileApi from 'app/api/sub/profile-api';

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
    privateKey: string;
    json: string;
}

interface IMarketStoreApi {
    fetchMarketBalance(addr: string): Promise<string>;
    fetchMarketStats(addr: string): Promise<IMarketStats>;
}

interface IMyProfilesStoreServices extends IOnlineStoreServices {
    profileApi: ProfileApi;
    marketApi: IMarketStoreApi;
}

const sortByName = sortBy(['name', 'address']);

export class MyProfilesStore extends OnlineStore {
    protected static PROFILE_INTERVAL = 60 * 1000;
    protected static BALANCE_INTERVAL = 2000;

    protected rootStore: RootStore;
    protected services: IMyProfilesStoreServices;

    constructor(rootStore: RootStore, services: IMyProfilesStoreServices) {
        super(services);
        this.rootStore = rootStore;
        this.services = services;
        this.getAccountList();

        reaction(() => this.accountMap.size, () => this.setCurrentProfile(), {
            fireImmediately: true,
            name: 'reaction accountMap.size',
        });

        reaction(
            () => this.currentProfileAddress,
            () => this.updateProfileDetails(),
            {
                name: 'reaction currentProfileAddress',
            },
        );

        reaction(
            () => this.currentProfileAddress,
            (_: string, r: IReactionPublic) => {
                setInterval(async () => {
                    await this.fetchProfileDetails();
                }, MyProfilesStore.PROFILE_INTERVAL);
                setInterval(async () => {
                    await this.updateBalanceAndStats();
                }, MyProfilesStore.BALANCE_INTERVAL);
                r.dispose();
            },
        );

        reaction(
            () => this.accountAddressList,
            () => this.updateTotalBalance(),
            {
                name: 'reaction accountAddressList',
            },
        );
    }

    //#region Private State

    @observable protected accountMap = new Map<string, IAccountInfo>();

    @observable protected currentProfileAddressInner: string = '';

    @observable
    protected currentProfileInner: IProfileFull = { ...emptyProfile };

    @observable protected marketAllBalanceInner: string = '0';

    @observable protected marketBalanceInner: string = '';

    @observable
    protected marketStatsInner: IMarketStats = {
        dealsCount: 0,
        dealsPrice: '0',
        daysLeft: 0,
    };

    //#endregion

    public getItem = (key: string) => this.accountMap.get(key);

    @computed
    public get marketAllBalance() {
        return this.marketAllBalanceInner;
    }

    @computed
    public get marketBalance() {
        return this.marketBalanceInner;
    }

    @computed
    public get marketStats(): IMarketStats {
        return { ...this.marketStatsInner };
    }

    @computed
    public get currentProfileAddress() {
        return this.currentProfileAddressInner;
    }

    @computed
    public get currentProfile(): IProfileFull {
        return { ...this.currentProfileInner };
    }

    @computed
    public get currentProfileView(): IAccountItemView | undefined {
        const currentAccount = this.getItem(this.currentProfileAddress);
        if (currentAccount) {
            return this.transformAccountInfoToView(currentAccount);
        }
        return undefined;
    }

    @action.bound
    public setCurrentProfile(accountAddress?: string) {
        if (accountAddress === undefined) {
            if (
                !this.accountMap.has(this.currentProfileAddress) &&
                this.accountMap.size > 0
            ) {
                this.currentProfileAddressInner = this.accountAddressList[0];
            } else {
                return;
            }
        } else {
            this.currentProfileAddressInner = accountAddress;
        }
    }

    @asyncAction
    protected *getAccountList() {
        const accountList = yield Api.getAccountList();
        updateAddressMap<IAccountInfo>(accountList, this.accountMap);
    }

    @computed
    public get accountAddressList() {
        return Array.from(this.accountMap.keys());
    }

    @computed
    public get accountList(): IAccountItemView[] {
        const result = Array.from(this.accountMap.values()).map(
            this.transformAccountInfoToView,
        );

        return sortByName(result) as IAccountItemView[];
    }

    protected transformAccountInfoToView = (
        info: IAccountInfo,
    ): IAccountItemView => {
        const isCurrencyListEmpty = this.rootStore.currencyStore.size === 0;
        const primaryTokenBalance = isCurrencyListEmpty
            ? ''
            : info.currencyBalanceMap[
                  this.rootStore.currencyStore.primaryTokenAddress
              ];

        const preview: IAccountItemView = {
            address: info.address,
            json: info.json,
            name: info.name,
            etherBalance: isCurrencyListEmpty
                ? ''
                : info.currencyBalanceMap[
                      this.rootStore.currencyStore.etherAddress
                  ],
            primaryTokenBalance,
            primaryTokenInfo: this.rootStore.currencyStore.primaryTokenInfo,
            usdBalance: info.marketUsdBalance,
            marketBalance: info.marketBalance,
        };

        return preview;
    };

    @catchErrors({ restart: false })
    @asyncAction
    public *deleteAccount(deleteAddress: string) {
        const { data: success } = yield Api.removeAccount(deleteAddress);

        if (success) {
            this.accountMap.delete(deleteAddress);
        }
    }

    @catchErrors({ restart: false })
    @asyncAction
    public *renameAccount(address: string, name: string) {
        const { data: success } = yield Api.renameAccount(address, name);

        if (success) {
            (this.accountMap.get(address) as IAccountInfo).name = name;
        }
    }

    // ToDo a: ServerValidation is a common feature. And we do not want to copypaste it between stores.
    @observable.ref public serverValidation: Partial<IMainFormValues> = {};

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *addAccount(
        json: string,
        password: string,
        name: string,
        privateKey?: string,
    ) {
        this.serverValidation = {};

        const { data, validation } = yield Api.addAccount(json, password, name);

        let result;

        if (validation) {
            const serverValidation = {
                ...this.services.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };

            if (privateKey) {
                serverValidation.privateKey = serverValidation.json;
                delete serverValidation.json;
            }

            this.serverValidation = serverValidation;
        } else {
            result = this.accountMap.set(data.address, data);
        }

        return result;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *createAccount(password: string, name: string, privateKey: string) {
        this.serverValidation = {};

        const { data, validation } = yield Api.createAccount(
            password,
            privateKey,
        );

        let result;

        if (validation) {
            this.serverValidation = {
                ...this.services.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };
        } else {
            result = yield this.addAccount(data, password, name, privateKey);
        }

        return result;
    }

    @pending
    @asyncAction
    public *getPrivateKey(password: string, address: string) {
        const { data: privateKey, validation } = yield Api.getPrivateKey(
            password,
            address,
        );

        if (validation) {
            return '';
        } else {
            return privateKey;
        }
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *updateProfileDetails() {
        yield this.fetchProfileDetails();
        yield this.updateBalanceAndStats();
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *fetchProfileDetails() {
        this.currentProfileInner = yield this.services.profileApi.fetchByAddress(
            this.rootStore.myProfilesStore.currentProfileAddress,
        );
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *updateBalanceAndStats() {
        yield this.updatePublicBalance();
        yield this.updateMarketStats();
    }

    //#region Balance

    @computed
    public get etherBalance(): string {
        return MyProfilesStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.etherAddress,
        );
    }

    @computed
    public get primaryTokenBalance(): string {
        return MyProfilesStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.primaryTokenAddress,
        );
    }

    private static getTokenBalance(fullList: ICurrencyInfo[], address: string) {
        const item = fullList.find(x => x.address === address);
        const balance = item ? item.balance : '';
        return balance || '0';
    }

    /**
     * Returns balance amount of passed accounts for each currency.
     */
    public getBalanceListFor(...accounts: string[]): ICurrencyInfo[] {
        const result = this.rootStore.currencyStore.list.map(
            (currency: ICurrencyInfo) => {
                let touched = false;
                const balance: BN = accounts.reduce(
                    (sum: any, accountAddr: string) => {
                        const account = this.rootStore.myProfilesStore.accountMap.get(
                            accountAddr,
                        ) as IAccountInfo;
                        const userBalance =
                            account.currencyBalanceMap[currency.address];

                        if (userBalance) {
                            touched = true;
                            sum = sum.add(createBigNumber(userBalance));
                        }

                        return sum;
                    },
                    ZERO,
                );

                return {
                    name: currency.name,
                    symbol: currency.symbol,
                    decimalPointOffset: currency.decimalPointOffset,
                    balance: touched ? balance.toString() : '',
                    address: currency.address,
                };
            },
        );

        return result;
    }

    @computed
    public get fullBalanceList(): ICurrencyInfo[] {
        const allAccountsAddresses = this.rootStore.myProfilesStore
            .accountAddressList;
        return this.getBalanceListFor(...allAccountsAddresses);
    }

    //#endregion

    //#region Market Balance and stats

    @catchErrors({ restart: true })
    @asyncAction
    protected *updateTotalBalance() {
        let balance = new BN(0);
        for (const account of this.accountList) {
            const accountBalance = yield this.services.marketApi.fetchMarketBalance(
                account.address,
            );
            balance = balance.add(new BN(accountBalance));
        }

        this.marketAllBalanceInner = balance.toString(10);
    }

    @catchErrors({ restart: true })
    @asyncAction
    protected *updatePublicBalance() {
        const balance = yield this.services.marketApi.fetchMarketBalance(
            this.currentProfileAddress,
        );

        this.marketBalanceInner = balance;
    }

    @catchErrors({ restart: true })
    @asyncAction
    protected *updateMarketStats() {
        this.marketStatsInner = yield this.services.marketApi.fetchMarketStats(
            this.currentProfileAddress,
        );
    }

    //#endregion
}
