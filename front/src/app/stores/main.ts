import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as sortBy from 'lodash/fp/sortBy';
import {
    Api,
    IAccountInfo,
    ICurrencyInfo,
} from 'app/api';
import * as BigNumber from 'bignumber.js';
import { ICurrencyItemProps } from 'app/components/common/currency-big-select';
import { IAccountItemProps } from 'app/components/common/account-item';
import {
    AlertType,
} from './types';
import { updateAddressMap } from './utils/updateAddressMap';
import { AbstractStore } from './abstract-store';
const { pending, catchErrors } = AbstractStore;
import { delay } from 'app/utils/async-delay';
import { trimZeros } from '../utils/trim-zeros';
import { getMessageText } from 'app/api/error-messages';
import { RootStore } from './';
import { IWalletListItem } from 'app/api/types';

const sortByName = sortBy(['name', 'address']);
const UPDATE_INTERVAL = 5000;

interface IMainFormValues {
    password: string;
    passwordConfirmation: string;
    accountName: string;
}

const emptyForm: IMainFormValues = {
    password: '',
    passwordConfirmation: '',
    accountName: '',
}

Object.freeze(emptyForm);

export class MainStore extends AbstractStore {
    public static ADDRESS_ETHER = '0x';

    protected rootStore: RootStore;

    @observable.ref protected walletInfo?: IWalletListItem;

    @computed public get walletName(): string {
        return this.walletInfo ? this.walletInfo.name : '';
    }

    @computed public get networkName(): string {
        return this.walletInfo ? this.walletInfo.chainId : '';
    }

    @computed public get nodeUrl(): string {
        return this.walletInfo ? this.walletInfo.nodeUrl : '';
    }

    @observable public validation = { ...emptyForm };

    constructor(rootStore: RootStore) {
        super({ errorProcessor: rootStore.uiStore });

        this.rootStore = rootStore;
    }

    @observable public averageGasPriceEther = '';

    @observable public accountMap = new Map<string, IAccountInfo>();

    @computed public get accountAddressList() {
        return Array.from(this.accountMap.keys());
    }

    @observable public currencyMap = new Map<string, ICurrencyInfo>();

    @computed public get currencyAddressList() {
        return Array.from(this.currencyMap.keys());
    }

    @computed
    public get gasPriceThresholds(): [string, string] {
        let min = '5';
        let max = '15';

        if (this.averageGasPriceEther !== '') {
            const bn = new BigNumber(this.averageGasPriceEther);

            min = trimZeros(bn.mul(0.5).toFixed(18));
            max = trimZeros(bn.mul(1.5).toFixed(18));
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

        if (!result) { throw new Error(`Ether not found`); }

        return result;
    }

    @computed
    public get primaryTokenInfo(): ICurrencyInfo {
        const result = this.currencyMap.get(this.primaryTokenAddress);

        if (!result) { throw new Error(`Second token ${this.primaryTokenAddress} not found`); }

        return result;
    }

    @computed
    public get etherBalance(): string {
        return MainStore.getTokenBalance(this.fullBalanceList, this.etherAddress);
    }

    @computed
    public get primaryTokenBalance(): string {
        return MainStore.getTokenBalance(this.fullBalanceList, this.primaryTokenAddress);
    }

    private static getTokenBalance(fullList: ICurrencyItemProps[], address: string) {
        const item = fullList.find(x => x.address === address);

        return item
            ? `${item.balance} ${item.symbol}`
            : '';
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
                    : `${account.currencyBalanceMap[etherAddress] || ''} ${this.etherInfo.symbol}`,
                primaryTokenBalance: isCurrencyListEmpty
                    ? ''
                    : `${account.currencyBalanceMap[primaryTokenAddress] || ''} ${this.primaryTokenInfo.symbol}`,
            };

            return props;
        });

        return sortByName(result) as IAccountItemProps[];
    }

    public getBalanceListFor(...accounts: string[]): ICurrencyItemProps[] {
        if (this.accountMap === undefined || this.currencyMap === undefined) {
            return [];
        }

        const result = Array.from(this.currencyMap.values()).map((currency): ICurrencyItemProps => {
            let touched = false;
            const balance = accounts.reduce((sum: any, accountAddr: string) => {
                    const account = this.accountMap.get(accountAddr) as IAccountInfo;
                    const userBalance = account.currencyBalanceMap[currency.address];

                    if (userBalance) {
                        touched = true;
                        sum = sum.plus(userBalance);
                    }

                    return sum;
                }, new BigNumber(0));

            return {
                name: currency.name,
                symbol: currency.symbol,
                decimals: currency.decimals,
                balance: touched ? trimZeros(balance.toFixed(18)) : '',
                address: currency.address,
            };
        });

        return result;
    }

    @computed
    public get fullBalanceList(): ICurrencyItemProps[] {
        const allAccounts = Array.from(this.accountMap.keys());

        return this.getBalanceListFor(...allAccounts);
    }

    @catchErrors({ restart: false })
    @asyncAction
    public * deleteAccount(deleteAddress: string) {
        const {data: success} = yield Api.removeAccount(deleteAddress);

        if (success) {
            this.accountMap.delete(deleteAddress);
        }
    }

    @catchErrors({ restart: false })
    @asyncAction
    public * renameAccount(address: string, name: string) {
        const { data: success } = yield Api.renameAccount(address, name);

        if (success) {
            (this.accountMap.get(address) as IAccountInfo).name = name;
        }
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public * init(wallet: IWalletListItem) {
        this.walletInfo = wallet;

        this.primaryTokenAddr = (yield Api.getSonmTokenAddress()).data;

        const [{data: currencyList}] = yield Promise.all([
            Api.getCurrencyList(),

            this.autoUpdateIteration(), // wait for first update
        ]);

        updateAddressMap<ICurrencyInfo>(currencyList, this.currencyMap);
    }

    @action
    protected updateList(accountList: IAccountInfo[] = []) {
        updateAddressMap<IAccountInfo>(accountList, this.accountMap);
    }

    @action
    protected setAverageGasPrice(gasPrice: string = '') {
        this.averageGasPriceEther = gasPrice;
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
            if (process.env.NODE_ENV !== 'production') {
                window.console.time('auto-update');
            }

            await this.update();

            await delay(interval);

            setTimeout(() => this.autoUpdateIteration(), 0);

        } finally {
            if (process.env.NODE_ENV !== 'production') {
                window.console.timeEnd('auto-update');
            }
        }
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public * addAccount(json: string, password: string, name: string) {
        const { data, validation } = yield Api.addAccount(json, password, name);

        if (validation) {
            this.validation = { ...emptyForm, ...validation };
        } else {
            this.validation = { ...emptyForm };
            this.accountMap.set(data.address, data);
        }

        return this.validation;
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public * createAccount(password: string, name: string) {
        const {data} = yield Api.createAccount(password);
        yield this.addAccount(data, password, name);
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public * giveMeMore(password: string, accountAddress: string) {
        const { validation } = yield Api.requestTestTokens(password, accountAddress);

        if (validation) {
            this.rootStore.uiStore.addAlert({
                type: AlertType.error,
                message: `SNM delivery delayed cause: ${getMessageText(validation.password)}`,
            });
        } else {
            this.rootStore.uiStore.addAlert({
                type: AlertType.success,
                message: getMessageText('wait_your_tokens'),
            });
        }
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public * removeToken(address: string) {
        const success = yield Api.removeToken(address);

        if (success) {
            this.currencyMap.delete(address);
        }
    }

    @pending
    @asyncAction
    public * getPrivateKey(password: string, address: string) {
        const { data: privateKey, validation } = yield Api.getPrivateKey(password, address);

        if (validation) {
            return '';
        } else {
            return privateKey;
        }
    }

    @pending
    @asyncAction
    protected * exportWallet() {
        const { data: text } = yield Api.exportWallet();

        return text;
    }

    public getWalletExportText = async () => {
        const text = await this.exportWallet();

        return String(text);
    }
}

export default MainStore;

export * from './types';
