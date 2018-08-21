import * as sortBy from 'lodash/fp/sortBy';
import { updateAddressMap } from './utils/update-address-map';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { observable, computed, action, reaction, IReactionPublic } from 'mobx';
import { asyncAction } from 'mobx-utils';
import Api, { IMarketStats, IResult } from 'app/api';
import { IValidation } from 'app/localization/types';
import { RootStore } from 'app/stores';
import { Account, IAccount, emptyAccount } from 'app/entities/account';
const { pending, catchErrors } = OnlineStore;
import { createBigNumber, ZERO, BN } from '../utils/create-big-number';
import { ICurrencyInfo } from 'common/types/currency';
import ProfileApi from 'app/api/sub/profile-api';
import { setIntervalAsync } from 'app/utils/set-interval-async';
import { IAccountInfo } from 'common/types/account';

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
    protected static CURRENT_INTERVAL = 5000;

    protected rootStore: RootStore;
    protected services: IMyProfilesStoreServices;

    constructor(rootStore: RootStore, services: IMyProfilesStoreServices) {
        super(services);
        this.rootStore = rootStore;
        this.services = services;
        this.getAccountList();

        reaction(() => this.accountMap.size, () => this.setCurrent(), {
            fireImmediately: true,
            name: 'reaction accountMap.size',
        });

        reaction(
            () => this.currentProfileAddress,
            (_: string, r: IReactionPublic) => {
                this.updateCurrentAccount();
                setIntervalAsync(async () => {
                    await this.updateCurrentAccount();
                }, MyProfilesStore.CURRENT_INTERVAL);
                r.dispose();
            },
        );

        reaction(
            () => this.accountAddressList,
            () => this.updateMarketBalance(),
            {
                name: 'reaction accountAddressList',
            },
        );
    }

    //#region Observables

    @observable protected accountMap = new Map<string, IAccount>();

    @observable public currentProfileAddress: string = '';

    @observable public marketAllBalance: string = '0';

    //#endregion

    //#region Private

    @asyncAction
    protected *getAccountList() {
        const accountList: IAccountInfo[] = yield Api.getAccountList();
        updateAddressMap<IAccountInfo>(
            accountList.map(this.accountFactory),
            this.accountMap,
        );
    }

    protected accountFactory = (data: IAccountInfo): Account => {
        return new Account(
            data,
            this.rootStore.currency.etherAddress,
            this.rootStore.currency.primaryTokenAddress,
        );
    };

    //#endregion

    // ToDo a: ServerValidation is a common feature. And we do not want to copypaste it between stores.
    @observable.ref public serverValidation: Partial<IMainFormValues> = {};

    public getItem = (key: string) => this.accountMap.get(key);

    @computed
    public get current(): IAccount | undefined {
        return this.getItem(this.currentProfileAddress);
    }

    @computed
    public get currentRequired(): IAccount {
        return this.current || emptyAccount;
    }

    @action.bound
    public setCurrent(accountAddress?: string) {
        if (accountAddress === undefined) {
            if (
                !this.accountMap.has(this.currentProfileAddress) &&
                this.accountMap.size > 0
            ) {
                this.currentProfileAddress = this.accountAddressList[0];
            } else {
                return;
            }
        } else {
            this.currentProfileAddress = accountAddress;
        }
    }

    @computed
    public get accountAddressList() {
        return Array.from(this.accountMap.keys());
    }

    @computed
    public get accountList(): IAccount[] {
        const result = Array.from(this.accountMap.values());
        return sortByName(result) as IAccount[];
    }

    //#region Account: create, rename, delete

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
            const account = this.getItem(address);
            if (account) {
                account.name = name;
            }
        }
    }

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

        const {
            data,
            validation,
        }: IResult<IAccountInfo> = yield Api.addAccount(json, password, name);

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
        } else if (data) {
            return this.accountMap.set(data.address, this.accountFactory(data));
        }
        return undefined;
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

    //#endregion

    //#region Updates

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *updateAllAccounts() {
        for (const address of this.accountAddressList) {
            yield this.updateAccount(address);
        }
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *updateCurrentAccount() {
        yield this.updateAccount(this.currentProfileAddress);
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *updateAccount(address: string) {
        const account = this.getItem(address);
        if (account) {
            account.profile = yield this.services.profileApi.fetchByAddress(
                address,
            );
            account.marketBalance = yield this.services.marketApi.fetchMarketBalance(
                address,
            );
            account.marketStats = yield this.services.marketApi.fetchMarketStats(
                address,
            );
        }
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    protected *updateMarketBalance() {
        for (const account of this.accountList) {
            account.marketBalance = yield this.services.marketApi.fetchMarketBalance(
                account.address,
            );
        }
        this.updateTotalBalance();
    }

    @action.bound
    protected updateTotalBalance() {
        let balance = new BN(0);
        for (const account of this.accountList) {
            balance = balance.add(new BN(account.marketBalance));
        }
        this.marketAllBalance = balance.toString(10);
    }

    //#endregion

    //#region Balance

    @computed
    public get etherBalance(): string {
        return MyProfilesStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currency.etherAddress,
        );
    }

    @computed
    public get primaryTokenBalance(): string {
        return MyProfilesStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currency.primaryTokenAddress,
        );
    }

    @computed
    public get fullBalanceList(): ICurrencyInfo[] {
        return this.getBalanceListFor(...this.accountAddressList);
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
        const result = this.rootStore.currency.list.map(
            (currency: ICurrencyInfo) => {
                let touched = false;
                const balance: BN = accounts.reduce(
                    (sum: any, accountAddr: string) => {
                        const account = this.accountMap.get(
                            accountAddr,
                        ) as IAccount;

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

    //#endregion

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
}
