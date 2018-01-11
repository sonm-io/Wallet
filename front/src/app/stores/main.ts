import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as sortBy from 'lodash/fp/sortBy';
import {
    Api,
    IAccountInfo,
    ICurrencyInfo,
    IValidation,
    ISendTransactionResult,
    TransactionStatus,
} from 'app/api';
import * as BigNumber from 'bignumber.js';
import { ICurrencyItemProps } from 'app/components/common/currency-big-select';
import { IAccountItemProps } from 'app/components/common/account-item';
import {
    ISendFormValues,
    TGasPricePriority,
    IPasswordCache,
    AlertType,
} from './types';
import { listToAddressMap } from './utils/listToAddressMap';
import { AbstractStore } from './abstract-store';
const { pending, catchErrors } = AbstractStore;
import { delay } from 'app/utils/async-delay';
import { etherToGwei } from '../utils/ether-to-gwei';
import { gweiToEther } from '../utils/gwei-to-ether';
import { trimZeros } from '../utils/trim-zeros';
import { getMessageText } from 'app/api/error-messages';

const sortByName = sortBy(['name', 'address']);
const UPDATE_INTERVAL = 5000;

export class MainStore extends AbstractStore {
    public static ADDRESS_ETHER = '0x';
    public static DEFAULT_GAS_LIMIT = '250000';

    protected sonmTokenAddress: string = '';

    @observable public averageGasPrice = '';

    @observable public notification = [];

    @observable public accountMap = new Map<string, IAccountInfo>();

    @observable public currencyMap = new Map<string, ICurrencyInfo>();

    @observable private userSelectedAccountAddress = '';

    @observable public userSelectedCurrencyAddress = '';

    @observable public userGasPrice = '';

    @observable public validation: IValidation = {};

    public values: ISendFormValues = {
        toAddress: '',
        amount: '',
        gasPrice: '',
        gasLimit: '',
    };

    @computed
    public get priority(): TGasPricePriority {
        let result: TGasPricePriority = 'normal';

        if (this.userGasPrice !== '') {
            const [min, max] = this.gasPriceThresholds;
            const userInput = new BigNumber(this.userGasPrice);
            if (userInput.lessThanOrEqualTo(min)) {
                result = 'low';
            } else if (userInput.greaterThanOrEqualTo(max)) {
                result = 'high';
            }
        }

        return result;
    }

    @computed
    public get gasPriceThresholds(): [string, string] {
        let min = '5';
        let max = '15';

        if (this.averageGasPrice !== '') {
            const bn = new BigNumber(this.averageGasPrice);

            min = trimZeros(bn.mul(0.5).toFixed(9));
            max = trimZeros(bn.mul(1.5).toFixed(9));
        }

        return [min, max];
    }

    public static findCurrencyBySymbol(map: Map<string, ICurrencyInfo>, symbol: string) {
        let result;

        if (map.size === 0) {
            return '';
        }

        const s = symbol.toUpperCase();

        map.forEach(
            (value, key) => {
                if (value.symbol.toUpperCase() === s) {
                    result = value.address;
                }
            },
        );

        if (result === undefined) {
            throw new Error(`token ${symbol} address  not found`);
        }

        return result;
    }

    public get firstTokenAddress(): string {
        return MainStore.ADDRESS_ETHER;
    }

    private secondTokenAddressProp = '';

    public get secondTokenAddress(): string {
        return this.secondTokenAddressProp;
    }

    @computed
    public get firstToken(): ICurrencyInfo {
        const result = this.currencyMap.get(this.firstTokenAddress);

        if (!result) { throw new Error(`First token ${this.firstTokenAddress} not found`); }

        return result;
    }

    @computed
    public get secondToken(): ICurrencyInfo {
        const result = this.currencyMap.get(this.secondTokenAddress);

        if (!result) { throw new Error(`Second token ${this.secondTokenAddress} not found`); }

        return result;
    }

    @computed
    public get firstTokenBalance(): string {
        return MainStore.getTokenBalance(this.fullBalanceList, this.firstTokenAddress);
    }

    @computed
    public get secondTokenBalance(): string {
        return MainStore.getTokenBalance(this.fullBalanceList, this.secondTokenAddress);
    }

    private static getTokenBalance(fullList: ICurrencyItemProps[], address: string) {
        const f = fullList.find(x => x.address === address);

        return f ? `${f.balance} ${f.symbol}` : '';
    }

    @computed
    public get accountList(): IAccountItemProps[] {
        if (
            this.accountMap === undefined
            || this.currencyMap === undefined
        ) {
            return [];
        }

        const isCurrencyListEmpty = this.currencyMap.size === 0;
        const firstTokenAddress = this.firstTokenAddress;
        const secondTokenAddress = this.secondTokenAddress;

        const result = Array.from(this.accountMap.values()).map(account => {
            const props: IAccountItemProps = {
                address: account.address,
                json: account.json,
                name: account.name,
                firstBalance: isCurrencyListEmpty ? '' : `${account.currencyBalanceMap[firstTokenAddress]} ${this.firstToken.symbol}`,
                secondBalance: isCurrencyListEmpty ? '' : `${account.currencyBalanceMap[secondTokenAddress]} ${this.secondToken.symbol}`,
            };

            return props;
        });

        return sortByName(result) as IAccountItemProps[];
    }

    private getBalanceListFor(...accounts: string[]): ICurrencyItemProps[] {
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

    @computed
    public get currentBalanceList(): ICurrencyItemProps[] {
        if (this.selectedAccountAddress === '') {
            return [];
        }

        return this.getBalanceListFor(this.selectedAccountAddress);
    }

    @catchErrors({ restart: true })
    @action
    public setUserGasPrice(value: string): void {
        const bn = new BigNumber(value);
        this.userGasPrice = bn.toString();
    }

    @catchErrors({ restart: false })
    @asyncAction
    public * deleteAccount(deleteAddress: string) {
        const {data: success} = yield Api.removeAccount(deleteAddress);

        if (success) {
            this.accountMap.delete(deleteAddress);
        }
    }

    @action.bound
    public decreaseBalance(accountAddress: string, currencyAddress: string, amount: string) {
        const account = this.accountMap.get(accountAddress) as IAccountInfo;
        if (account === undefined) {
            throw new Error(`Unknown accountAddress ${accountAddress}`);
        }

        const balance = account.currencyBalanceMap[currencyAddress];
        if (balance === undefined) {
            throw new Error(`Unknown accountAddress ${accountAddress}`);
        }

        account.currencyBalanceMap[currencyAddress] = new BigNumber(balance).minus(amount).toString();
    }

    @action.bound
    public selectAccount(accountAddr: string) {
        if (accountAddr !== this.userSelectedAccountAddress) {
            this.userSelectedAccountAddress = accountAddr;
        }
    }

    @action.bound
    public selectCurrency(currencyAddr: string) {
        this.userSelectedCurrencyAddress = currencyAddr;
    }

    @computed
    public get selectedAccountAddress(): string {
        const addr = this.userSelectedAccountAddress;

        return this.accountMap.has(addr)
            ? addr
            : (this.accountMap.size > 0)
                ? this.accountMap.keys().next().value
                : '';

    }

    @computed
    public get selectedCurrencyAddress(): string {
        const addr = this.userSelectedCurrencyAddress;

        return this.currencyMap.has(addr)
            ? addr
            : (this.currencyMap.size > 0)
                ? this.currencyMap.keys().next().value
                : '';

    }

    @action.bound
    public setSendParams(values: ISendFormValues) {
        this.values = values;
    }

    @catchErrors({ restart: false })
    @asyncAction
    public * renameAccount(address: string, name: string) {
        const success = yield Api.renameAccount(address, name);

        if (success) {
            (this.accountMap.get(address) as IAccountInfo).name = name;
        }
    }

    protected passwordCache: IPasswordCache = {};

    @pending
    @asyncAction
    public * checkSelectedAccountPassword(password: string) {
        const accountAddress = this.selectedAccountAddress;

        let validationMessage = '';

        if (accountAddress in this.passwordCache
            && this.passwordCache[accountAddress] === password) {
            validationMessage = '';
        } else {
            const {data: success, validation} = yield Api.checkPrivateKey(password, accountAddress);

            if (success) {
                this.passwordCache[accountAddress] = password;
                validationMessage = '';
            } else if (validation && validation.password) {
                validationMessage = validation.password;
            }
        }

        this.validation.password = validationMessage;

        return validationMessage === '';
    }

    @catchErrors({ restart: false })
    @asyncAction
    public * confirmTransaction(password: string) {
        const tx = {
            toAddress: this.values.toAddress,
            amount: this.values.amount,
            fromAddress: this.selectedAccountAddress,
            currencyAddress: this.selectedCurrencyAddress,
            gasPrice: gweiToEther(this.values.gasPrice),
            gasLimit: this.values.gasLimit,
            timestamp: Date.now(),
        };

        this.values.toAddress = '';
        this.values.amount = '';

        const { data } = yield Api.send(tx, password);

        const result = data as ISendTransactionResult;

        let alert;
        if (result.status === TransactionStatus.success) {
            const currency = this.currencyMap.get(result.currencyAddress);
            const currencyName = currency ? currency.symbol : '';

            alert = {
                type: AlertType.success,
                message: `Transaction is completed successfully. ${result.amount} ${currencyName} has been sent to the address ${result.toAddress}. TxHash ${result.hash}`,
            };
        } else if (result.status === TransactionStatus.failed) {
            alert = {
                type: AlertType.error,
                message: `Transaction to the address ${result.toAddress} was failed. TxHash ${result.hash}`,
            };
        } else {
            alert = { type: AlertType.error, message: JSON.stringify(result) };
        }
        this.addAlert(alert);

        return result;
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public * init() {
        this.secondTokenAddressProp = (yield Api.getSonmTokenAddress()).data;

        const [{data: currencyList}] = yield Promise.all([
            Api.getCurrencyList(),

            this.autoUpdateIteration(UPDATE_INTERVAL), // wait for first update
        ]);

        listToAddressMap<ICurrencyInfo>(currencyList, this.currencyMap);

        this.userGasPrice = this.averageGasPrice;
    }

    @action
    protected updateList(accountList: IAccountInfo[] = []) {
        listToAddressMap<IAccountInfo>(accountList, this.accountMap);
    }

    @action
    protected updateGasPrice(averageGasPrice: string = '') {
        this.averageGasPrice = etherToGwei(averageGasPrice);
    }

    public async update() {
        const { data: accountList } = await Api.getAccountList();
        this.updateList(accountList);

        const { data: averageGasPrice } = await Api.getGasPrice();
        this.updateGasPrice(averageGasPrice);
    }

    @catchErrors({ restart: true })
    protected async autoUpdateIteration(interval: number) {
        try {
            window.console.time('auto-update');

            await this.update();

            await delay(interval);

            this.autoUpdateIteration(interval);

        } finally {
            window.console.timeEnd('auto-update');
        }
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public * addAccount(json: string, password: string, name: string) {
        const { data, validation } = yield Api.addAccount(json, password, name);

        if (validation) {
            this.validation = validation;
        } else {
            this.validation = {};
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

    @computed
    get currentBalanceMaximum() {
        return this.getMaxValue(this.averageGasPrice, MainStore.DEFAULT_GAS_LIMIT);
    }

    public getMaxValue(gasPrice: string, gasLimit: string) {
        let gp;
        let gl;

        try {
            gp = new BigNumber(gweiToEther(gasPrice));
            gl = new BigNumber(gasLimit);
        } catch (e) {
            gp = new BigNumber(gweiToEther(this.averageGasPrice));
            gl = new BigNumber(MainStore.DEFAULT_GAS_LIMIT);
        }

        const account = this.accountMap.get(this.selectedAccountAddress) as IAccountInfo;

        let amount = new BigNumber(
            account.currencyBalanceMap[this.selectedCurrencyAddress],
        );

        if (this.firstTokenAddress === this.selectedCurrencyAddress) {
            const fee = gp.mul(gl);
            amount = amount.minus(fee);
        }

        return amount.lessThan(0) ? '0' : amount.toString();
    }

    @action
    protected setValidation(params: IValidation) {
        this.validation = params;
    }

    public resetValidation() {
        this.setValidation({});
    }

    @pending
    @catchErrors({ restart: false })
    @asyncAction
    public * giveMeMore(password: string) {
        const { validation } = yield Api.requestTestTokens(password, this.selectedAccountAddress);

        if (validation) {
            this.addAlert({ type: AlertType.error, message: `SNM delivery delayed cause: ${getMessageText(validation.password)}` });
        } else {
            this.addAlert({ type: AlertType.success, message: getMessageText('wait_your_tokens') });
        }
    }
}

export default MainStore;

export * from './types';
