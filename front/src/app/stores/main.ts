import { observable, action, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as sortBy from 'lodash/fp/sortBy';
import { Api, IAccountInfo, ICurrencyInfo } from 'app/api';
import { ICurrencyItemProps } from 'app/components/common/currency-big-select';
import { IAccountItemProps } from 'app/components/common/account-item';
import { AlertType } from './types';
import { updateAddressMap } from './utils/update-address-map';
import { OnlineStore } from './online-store';
const { pending, catchErrors } = OnlineStore;
import { delay } from 'app/utils/async-delay';
import { trimZeros } from '../utils/trim-zeros';
import { RootStore } from './';
import { IWalletListItem } from 'app/api/types';
import {
    createBigNumber,
    TWO,
    THREE,
    ZERO,
    BN,
} from '../utils/create-big-number';
import { normalizeCurrencyInfo } from './utils/normalize-currency-info';
import { IHasLocalizator, ILocalizator, IValidation } from 'app/localization';

const sortByName = sortBy(['name', 'address']);
const UPDATE_INTERVAL = 5000;

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
    privateKey: string;
}

const emptyForm: IMainFormValues = {
    password: '',
    passwordConfirmation: '',
    accountName: '',
    privateKey: '',
};

Object.freeze(emptyForm);

export class MainStore extends OnlineStore implements IHasLocalizator {
    constructor(rootStore: RootStore, localizator: ILocalizator) {
        super({
            errorProcessor: rootStore.uiStore,
            localizator,
        });

        this.rootStore = rootStore;
        this.localizator = localizator;

        autorun(() => {
            if (Array.from(this.currencyMap.keys()).length > 0) {
                this.update();
            }
        });
    }

    public static ADDRESS_ETHER = '0x';

    protected rootStore: RootStore;

    @observable.ref protected walletInfo?: IWalletListItem;

    @computed
    public get walletName(): string {
        return this.walletInfo ? this.walletInfo.name : '';
    }

    @computed
    public get networkName(): string {
        return (this.walletInfo ? this.walletInfo.chainId : '').toLowerCase();
    }

    @computed
    public get nodeUrl(): string {
        return this.walletInfo ? this.walletInfo.nodeUrl : '';
    }

    @computed
    public get noValidationMessages(): boolean {
        return Object.keys(this.serverValidation).length === 0;
    }

    @observable.ref public serverValidation: Partial<IMainFormValues> = {};

    @observable public averageGasPrice = '';

    @observable public accountMap = new Map<string, IAccountInfo>();

    @computed
    public get accountAddressList() {
        return Array.from(this.accountMap.keys());
    }

    @observable public currencyMap = new Map<string, ICurrencyInfo>();

    @computed
    public get currencyAddressList() {
        return Array.from(this.currencyMap.keys());
    }

    @computed
    public get gasPriceThresholds(): [string, string] {
        let min = '5';
        let max = '15';

        if (this.averageGasPrice !== '') {
            const bn = createBigNumber(this.averageGasPrice);

            if (bn) {
                min = trimZeros(bn.div(TWO));
                max = trimZeros(bn.mul(THREE).div(TWO));
            }
        }

        return [min, max];
    }

    public get etherAddress(): string {
        return MainStore.ADDRESS_ETHER;
    }

    protected primaryTokenAddr: string = '';
    public get primaryTokenAddress(): string {
        return this.primaryTokenAddr;
    }

    @computed
    public get etherInfo(): ICurrencyInfo {
        const result = this.currencyMap.get(this.etherAddress);

        if (!result) {
            throw new Error(`Ether not found`);
        }

        return result;
    }

    @computed
    public get primaryTokenInfo(): ICurrencyInfo {
        const result = this.currencyMap.get(this.primaryTokenAddress);

        if (!result) {
            throw new Error(
                `Second token ${this.primaryTokenAddress} not found`,
            );
        }

        return result;
    }

    @computed
    public get etherBalance(): string {
        return MainStore.getTokenBalance(
            this.fullBalanceList,
            this.etherAddress,
        );
    }

    @computed
    public get primaryTokenBalance(): string {
        return MainStore.getTokenBalance(
            this.fullBalanceList,
            this.primaryTokenAddress,
        );
    }

    private static getTokenBalance(
        fullList: ICurrencyItemProps[],
        address: string,
    ) {
        const item = fullList.find(x => x.address === address);

        return item ? item.balance : '';
    }

    @computed
    public get accountList(): IAccountItemProps[] {
        const isCurrencyListEmpty = this.currencyMap.size === 0;
        const etherAddress = this.etherAddress;
        const primaryTokenAddress = this.primaryTokenAddress;

        const result = Array.from(this.accountMap.values()).map(account => {
            const props: IAccountItemProps = {
                address: account.address,
                json: account.json,
                name: account.name,
                etherBalance: isCurrencyListEmpty
                    ? ''
                    : account.currencyBalanceMap[etherAddress],
                primaryTokenBalance: isCurrencyListEmpty
                    ? ''
                    : account.currencyBalanceMap[primaryTokenAddress],
                primaryTokenInfo: this.primaryTokenInfo,
            };

            return props;
        });

        return sortByName(result) as IAccountItemProps[];
    }

    public getBalanceListFor(...accounts: string[]): ICurrencyItemProps[] {
        if (this.accountMap === undefined || this.currencyMap === undefined) {
            return [];
        }

        const result = Array.from(this.currencyMap.values()).map(
            (currency): ICurrencyItemProps => {
                let touched = false;
                const balance: BN = accounts.reduce(
                    (sum: any, accountAddr: string) => {
                        const account = this.accountMap.get(
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
    public get fullBalanceList(): ICurrencyItemProps[] {
        const allAccounts = Array.from(this.accountMap.keys());

        return this.getBalanceListFor(...allAccounts);
    }

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

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *init(wallet: IWalletListItem) {
        this.walletInfo = wallet;

        this.primaryTokenAddr = (yield Api.getSonmTokenAddress()).data;

        const [{ data: currencyList }] = yield Promise.all([
            Api.getCurrencyList(),

            this.autoUpdateIteration(), // wait for first update
        ]);

        updateAddressMap<ICurrencyInfo>(
            currencyList.map(normalizeCurrencyInfo),
            this.currencyMap,
        );
    }

    @action
    protected updateList(accountList: IAccountInfo[] = []) {
        updateAddressMap<IAccountInfo>(accountList, this.accountMap);
    }

    @action
    protected setAverageGasPrice(gasPrice: string = '') {
        this.averageGasPrice = gasPrice;
    }

    public async update() {
        const { data: accountList } = await Api.getAccountList();
        this.updateList(accountList);

        const { data: gasPrice } = await Api.getGasPrice();
        this.setAverageGasPrice(gasPrice);
    }

    @catchErrors({ restart: true })
    protected async autoUpdateIteration(interval: number = UPDATE_INTERVAL) {
        try {
            if (IS_DEV) {
                window.console.time('auto-update');
            }

            await this.update();

            await delay(interval);

            setTimeout(() => this.autoUpdateIteration(), 0);
        } finally {
            if (IS_DEV) {
                window.console.timeEnd('auto-update');
            }
        }
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *addAccount(json: string, password: string, name: string) {
        const { data, validation } = yield Api.addAccount(json, password, name);

        let result;

        if (validation) {
            this.serverValidation = {
                ...this.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };
        } else {
            this.serverValidation = {};
            result = this.accountMap.set(data.address, data);
        }

        return result;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *createAccount(password: string, name: string, privateKey: string) {
        const { data, validation } = yield Api.createAccount(
            password,
            privateKey,
        );

        let result;

        if (validation) {
            this.serverValidation = {
                ...this.localizator.localizeValidationMessages(
                    validation as IValidation,
                ),
            };
        } else {
            result = yield this.addAccount(data, password, name);
        }

        return result;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public *giveMeMore(password: string, accountAddress: string) {
        const { validation } = yield Api.requestTestTokens(
            password,
            accountAddress,
        );

        if (validation) {
            this.rootStore.uiStore.addAlert({
                type: AlertType.error,
                message: `SNM delivery delayed cause: ${this.rootStore.localizator.getMessageText(
                    validation.password,
                )}`,
            });
        } else {
            this.rootStore.uiStore.addAlert({
                type: AlertType.success,
                message: this.rootStore.localizator.getMessageText(
                    'wait_your_tokens',
                ),
            });
        }
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *removeToken(address: string) {
        const success = yield Api.removeToken(address);

        if (success) {
            this.currencyMap.delete(address);
        }
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
    @asyncAction
    protected *exportWallet() {
        const { data: text } = yield Api.exportWallet();

        return text;
    }

    public getWalletExportText = async () => {
        const text = await this.exportWallet();

        return String(text);
    };

    @action.bound
    public resetServerValidation() {
        this.serverValidation = {};
    }

    public readonly localizator: ILocalizator;
}

export default MainStore;

export * from './types';

/**
 * 0xb900726a920ae31c4381b9d9ec1e0d7e990cac3c Zaschecoin
 * 0xbda864e991a5ff6f7cc12a73ecb21fcefddd4795 ZASCHECOIN10
 */
