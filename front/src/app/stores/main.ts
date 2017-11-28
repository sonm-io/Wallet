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
import { ISendTransactionParams } from '../api/types';

const sortByName = sortBy(['name', 'address']);

export interface IHasAddress {
    address: string;
}

export interface IAddressMap<T extends IHasAddress> {
    [address: string]: T;
}

export type TGasPricePriority = 'low' | 'normal' | 'high';

export class MainStore {
    @observable public averageGasPrice = '';

    @observable public notification = [];

    @observable public accountMap = new Map<string, IAccountInfo>();

    @observable public currencyMap =  new Map<string, ICurrencyInfo>();

    @observable public selectedAccountAddress = '';

    @observable public selectedCurrencyAddress = '0x';

    @observable public userGasPrice = '';

    @observable public showConfirmDialog = false;

    @observable public isReady = false;

    public values = {
        toAddress: '',
        amount: '',
        gasPrice: '',
        gasLimit: '',
    };

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

            min = bn.mul(0.5).toString();
            max = bn.mul(1.5).toString();
        }

        return [min, max];
    }

    private static findCurrencyBySymbol(map: Map<string, ICurrencyInfo>, symbol: string) {
        let result;

        if (map.size === 0) {
            return '';
        }

        map.forEach(
            (value, key) => {
                if (value.symbol.toUpperCase() === symbol) {
                    result = value.address;
                }
            },
        );

        if (result === undefined) { throw new Error(`token ${symbol} address  not found`); }

        return result;
    }

    @computed public get sonmTokenAddress(): string {
        return MainStore.findCurrencyBySymbol(this.currencyMap, 'SNMT');
    }

    @computed public get etherTokenAddress(): string {
        return MainStore.findCurrencyBySymbol(this.currencyMap, 'ETH');
    }

    @computed public get accountList(): IAccountItemProps[] {
        if (this.accountMap === undefined || this.currencyMap === undefined) {
            return [];
        }

        const sonmTokenAddress = this.sonmTokenAddress;
        const etherTokenAddress = this.etherTokenAddress;

        const result = Array.from(this.accountMap.values()).map(account => {
            return {
                address: account.address,
                name: account.name,
                sonmBalance: account.currencyBalanceMap[sonmTokenAddress],
                etherBalance: account.currencyBalanceMap[etherTokenAddress],
            };
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
                balance: accounts.reduce((sum: any, accountAddr: string) => {
                    const account = this.accountMap.get(accountAddr);

                    if (account) {
                        sum = sum.plus(account.currencyBalanceMap[currency.address]);
                    }

                    return sum;
                }, new BigNumber(0)).toString(),
                address: currency.address,
            };
        });

        return result;
    }

    @computed public get fullBalanceList(): ICurrencyItemProps[]  {
        return this.getBalanceListFor(...Object.keys(this.accountMap));
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
            console.error(e);
        }
    }

    @action.bound
    public deleteAccount(deleteAddress: string): void {

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
    public setSelectedAccount(accountAddr: string) {
        this.selectedAccountAddress = accountAddr;
    }

    @action.bound
    public setSelectedCurrency(currencyAddr: string) {
        this.selectedCurrencyAddress = currencyAddr;
    }

    @action.bound
    public setSendParams(values: ISendTransactionParams) {
        this.values = values;
        this.showConfirmDialog = true;
    }

    @asyncAction
    public *init() {
        const result = yield Promise.all([
            Api.getGasPrice(),
            Api.getAccountList(),
            Api.getCurrencyList(),
        ]).catch(error => {
            throw new Error(error);
        });

        const [
            { data: averageGasPrice },
            { data: accountList },
            { data: currencyList },
        ] = result;

        this.averageGasPrice = averageGasPrice;
        this.userGasPrice = averageGasPrice;
        listToMap<IAccountInfo>(accountList, this.accountMap);
        listToMap<ICurrencyInfo>(currencyList, this.currencyMap);

        if (this.selectedAccountAddress === '') {
            this.selectedAccountAddress = this.accountList[0].address;
        }

        this.isReady = true;
    }
}

function listToMap<T extends IHasAddress>(list: T[], map: Map<string, T>): void {
    list.forEach(item  => map.set(item.address, item));
}
