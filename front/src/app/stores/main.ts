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

const sortByName = sortBy(['name', 'address']);
const UPDATE_INTERVAL = 5000;
const MAX_VISIBLE_ERRORS = 5;

export interface IHasAddress {
    address: string;
}

export interface IAddressMap<T extends IHasAddress> {
    [address: string]: T;
}

export interface ISendFormValues {
    amount: string;
    gasPrice: string;
    gasLimit: string;
    toAddress: string;
}

export type TGasPricePriority = 'low' | 'normal' | 'high';

export class MainStore {
    public static SYMBOL_SONM = 'snmt';
    public static SYMBOL_ETHER = 'eth';
    public static DEFAULT_GAS_LIMIT = '50000';

    @observable public averageGasPrice = '';

    @observable public notification = [];

    @observable public accountMap = new Map<string, IAccountInfo>();

    @observable public currencyMap =  new Map<string, ICurrencyInfo>();

    @observable private userSelectedAccountAddress = '';

    @observable public userSelectedCurrencyAddress = '';

    @observable public userGasPrice = '';

    @observable public showConfirmDialog = false;

    @observable public isReady = false;

    @observable public errors: any[] = [];

    public values: ISendFormValues = {
        toAddress: '',
        amount: '',
        gasPrice: '',
        gasLimit: '',
    };

    @computed get lastErrors(): any[] {
        const len = this.errors.length;
        if (len === 0) {
            return [];
        }

        debugger;

        return this.errors.slice(len - MAX_VISIBLE_ERRORS);
    }

    @computed public get priority(): TGasPricePriority {
        let result: TGasPricePriority = 'normal';

        if (this.userGasPrice !== '') {
            const [ min, max ] = this.gasPriceThresholds;
            const userInput = new BigNumber(this.userGasPrice);
            if (userInput.lessThanOrEqualTo(min)) {
                result = 'low';
            } else if (userInput.greaterThanOrEqualTo(max)) {
                result = 'high';
            }
        }

        return result;
    }

    @computed public get gasPriceThresholds(): [string, string] {
        let min = '5000';
        let max = '15000';

        if (this.averageGasPrice !== '') {
            const bn = new BigNumber(this.averageGasPrice);

            min = bn.mul(0.5).toFixed(18);
            max = bn.mul(1.5).toFixed(18);
        }

        return [min, max];
    }

    private static findCurrencyBySymbol(map: Map<string, ICurrencyInfo>, symbol: string) {
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

        if (result === undefined) { throw new Error(`token ${symbol} address  not found`); }

        return result;
    }

    @computed public get firstTokenAddress(): string {
        return MainStore.findCurrencyBySymbol(this.currencyMap, MainStore.SYMBOL_SONM);
    }

    @computed public get secondTokenAddress(): string {
        return MainStore.findCurrencyBySymbol(this.currencyMap, MainStore.SYMBOL_ETHER);
    }

    @computed public get firstTokenBalance(): string {
        return MainStore.getTokenBalance(this.fullBalanceList, this.firstTokenAddress);
    }

    @computed public get secondTokenBalance(): string {
        return MainStore.getTokenBalance(this.fullBalanceList, this.secondTokenAddress);
    }

    private static getTokenBalance(fullList: ICurrencyItemProps[], address: string) {
        const f = fullList.find(x => x.address === address);

        return f ? `${f.balance} ${f.symbol}` : `Token ${address} not found`;
    }

    @computed public get accountList(): IAccountItemProps[] {
        if (this.accountMap === undefined || this.currencyMap === undefined) {
            return [];
        }

        const firstTokenAddress = this.firstTokenAddress;
        const secondTokenAddress = this.secondTokenAddress;

        const result = Array.from(this.accountMap.values()).map(account => {
            const props: IAccountItemProps = {
                address: account.address,
                name: account.name,
                firstBalance: `${account.currencyBalanceMap[firstTokenAddress]} ${MainStore.SYMBOL_SONM}`,
                secondBalance: `${account.currencyBalanceMap[secondTokenAddress]} ${MainStore.SYMBOL_ETHER}`,
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
            return {
                name: currency.name,
                symbol: currency.symbol,
                decimals: currency.decimals,
                balance: accounts.reduce((sum: any, accountAddr: string) => {
                    const account = this.accountMap.get(accountAddr);

                    if (account) {
                        sum = sum.plus(account.currencyBalanceMap[currency.address]);
                    }

                    return sum;
                }, new BigNumber(0)).toFixed(currency.decimals),
                address: currency.address,
            };
        });

        return result;
    }

    @computed public get fullBalanceList(): ICurrencyItemProps[]  {
        const allAccounts = Array.from(this.accountMap.keys());

        return this.getBalanceListFor(...allAccounts);
    }

    @computed public get currentBalanceList(): ICurrencyItemProps[] {
        if (this.selectedAccountAddress === '') {
            return [];
        }

        return this.getBalanceListFor(this.selectedAccountAddress);
    }

    @action.bound
    public setUserGasPrice(value: string): void  {
        try {
            const bn = new BigNumber(value);
            this.userGasPrice = bn.toString();
        } catch (e) {
            this.handleError(e);
        }
    }

    @asyncAction
    public *deleteAccount(deleteAddress: string) {
        try {
            const { data: success } = yield Api.removeAccount(deleteAddress);

            if (success) {
                this.accountMap.delete(deleteAddress);
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    @action.bound
    public decreaseBalance(accountAddress: string, currencyAddress: string, amount: string) {
        const account = this.accountMap.get(accountAddress) as IAccountInfo;
        if (account === undefined) { throw new Error(`Unknown accountAddress ${accountAddress}`); }

        const balance = account.currencyBalanceMap[currencyAddress];
        if (balance === undefined) { throw new Error(`Unknown accountAddress ${accountAddress}`); }

        account.currencyBalanceMap[currencyAddress] = new BigNumber(balance).minus(amount).toString();
    }

    @action.bound
    public selectAccount(accountAddr: string) {
        this.userSelectedAccountAddress = accountAddr;
    }

    @action.bound
    public selectCurrency(currencyAddr: string) {
        this.userSelectedCurrencyAddress = currencyAddr;
    }

    @computed public get selectedAccountAddress(): string {
        const addr = this.userSelectedAccountAddress;

        return this.accountMap.has(addr)
            ? addr
            : (this.accountMap.size > 0)
                ? this.accountMap.keys().next().value
                : '';

    }

    @computed public get selectedCurrencyAddress(): string {
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

    @asyncAction
    public *renameAccount(address: string, name: string) {
        try {
            const success = yield Api.renameAccount(address, name);

            if (success) {
                (this.accountMap.get(address) as IAccountInfo).name = name;
            }
        } catch (e) {
            this.handleError(e);
        }
    }

    @asyncAction
    public *confirmTransaction(password: string) {
        try {
            const result = yield Api.send({
                toAddress: this.values.toAddress,
                amount: this.values.amount,
                fromAddress: this.selectedAccountAddress,
                currencyAddress: this.selectedCurrencyAddress,
                gasPrice: this.values.gasPrice,
                gasLimit: this.values.gasLimit,
                timestamp: Date.now(),
            }, password);

            window.alert(JSON.stringify(result));
        } catch (e) {
            this.handleError(e);
        }
    }

    @asyncAction
    public *init() {
        try {
            this.isReady = false;

            const [{data: currencyList}] = yield Promise.all([
                Api.getCurrencyList(),
                this.startAutoUpdate(UPDATE_INTERVAL), // wait for first update
            ]);

            listToMap<ICurrencyInfo>(currencyList, this.currencyMap);

            this.userGasPrice = this.averageGasPrice;
        } catch (e) {
            this.handleError(e);
        } finally {
            this.isReady = true;
        }
    }

    @action
    private update(result: any) {
        const [
            { data: averageGasPrice },
            { data: accountList },
        ] = result;

        this.averageGasPrice = averageGasPrice;
        listToMap<IAccountInfo>(accountList, this.accountMap);
    }

    public startAutoUpdate(interval: number) {
        const iteration = async () => {
            try {
                window.console.time('update')

                const result = await Promise.all([
                    Api.getGasPrice(),
                    Api.getAccountList(),
                ]);

                this.update(result);
            } catch (e) {
                this.handleError(e);
            } finally {
                window.console.timeEnd('update');
                setTimeout(iteration, interval);
            }
        };

        return iteration();
    }

    @asyncAction
    public *addAccount(json: string, password: string, name: string) {
        try {

            const {data, validation} = yield Api.addAccount(json, password, name);

            console.log(validation); // TODO

            this.accountMap.set(data.address, data);
        } catch (e) {
            this.handleError(e);
        }
    }

    public getMaxValue(gasPrice: string, gasLimit: string) {
        let gp;
        let gl;

        try {
            gp = new BigNumber(gasPrice);
            gl = new BigNumber(gasLimit);
        } catch (e) {
            gp = new BigNumber(this.averageGasPrice);
            gl = new BigNumber(MainStore.DEFAULT_GAS_LIMIT);
        }

        const amount = (this.accountMap.get(this.selectedAccountAddress) as IAccountInfo)
            .currencyBalanceMap[this.selectedCurrencyAddress];

        if (this.secondTokenAddress === this.selectedCurrencyAddress) {
            return (new BigNumber(amount).minus(new BigNumber(gp).mul(gl))).toString();
        } else {
            return amount;
        }
    }

    @action
    private handleError(e: Error) {
        console.error(e);

        this.errors.push(e.message);
    }
}

function listToMap<T extends IHasAddress>(list: T[], map: Map<string, T>): void {
    list.forEach(item  => map.set(item.address, item));
}
