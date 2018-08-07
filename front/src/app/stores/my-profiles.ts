import * as sortBy from 'lodash/fp/sortBy';
import { updateAddressMap } from './utils/update-address-map';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { observable, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { IAccountItemView } from 'app/stores/types';
import Api from 'app/api';
import { IValidation } from 'app/localization/types';
import { RootStore } from 'app/stores';
import { IAccountInfo } from 'app/entities/account';
const { pending, catchErrors } = OnlineStore;
import { createBigNumber, ZERO, BN } from '../utils/create-big-number';
import { ICurrencyInfo } from 'app/entities/currency';

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
    privateKey: string;
    json: string;
}

const sortByName = sortBy(['name', 'address']);

export class MyProfilesStore extends OnlineStore {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore, services: IOnlineStoreServices) {
        super(services);
        this.rootStore = rootStore;
        autorun(() => {
            if (this.rootStore.walletStore.isLoginSuccess) {
                this.getAccountList();
            }
        });
    }

    @observable public accountMap = new Map<string, IAccountInfo>();

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

    public transformAccountInfoToView = (
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

    //#region Balance

    @computed
    public get etherBalance(): string {
        return MyProfilesStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.etherAddress,
        );
    }

    // ToDo a
    @computed
    public get primaryTokenBalance(): string {
        return MyProfilesStore.getTokenBalance(
            this.fullBalanceList,
            this.rootStore.currencyStore.primaryTokenAddress,
        );
    }

    // ToDo a
    private static getTokenBalance(fullList: ICurrencyInfo[], address: string) {
        const item = fullList.find(x => x.address === address);
        const balance = item ? item.balance : '';
        return balance || '0';
    }

    // ToDo a
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

    // ToDo a
    @computed
    public get fullBalanceList(): ICurrencyInfo[] {
        const allAccountsAddresses = this.rootStore.myProfilesStore
            .accountAddressList;
        return this.getBalanceListFor(...allAccountsAddresses);
    }

    //#endregion
}
