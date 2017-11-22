import { observable, action, computed, toJS } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as sortBy from 'lodash/fp/sortBy';
import * as api from 'app/api';
import BigNumber from 'bignumber.js';

const sortByName = sortBy(['name', 'address']);

export interface IMainStore {
    averageGasPrice: string;
    currencyMap: IAddressMap<api.ICurrencyInfo>;
    accountMap: IAddressMap<api.IAccountInfo>;
}

export interface IHasAddress {
    address: string;
}

export interface IAddressMap<T extends IHasAddress> {
    [address: string]: T;
}

export interface ICurrencyDetails extends api.ICurrencyInfo {
    balance: string;
}

export class MainStore implements IMainStore {
    @observable public averageGasPrice = '';

    @observable public notification = [];

    @observable public accountMap: IAddressMap<api.IAccountInfo>;

    @observable public currencyMap: IAddressMap<api.ICurrencyInfo>;

    @computed public get accountList() {
        const arr = Object.keys(this.currencyMap).map(addr => toJS(this.accountMap[addr]));

        return sortByName(arr) as api.IAccountInfo[];
    }

    @computed public get balanceList() {
        const details: any = Object.keys(this.currencyMap).map(addr => ({
            balance: new BigNumber(0),
            ...toJS(this.currencyMap[addr]),
        }));

        const accounts = this.accountList;

        accounts.forEach(account => {
            details.forEach((detail: any) => {
                detail.balance = detail.balance.plus(account.currencyBalanceMap[detail.address]);
            });
        });

        return sortByName(details) as ICurrencyDetails[];
    }

    @action.bound
    public decreaseBalance(accountAddress: string, currencyAddress: string, amount: string) {
        const account = this.accountMap[accountAddress] as api.IAccountInfo;
        if (account === undefined) { throw new Error(`Unknown accountAddress ${accountAddress}`); }

        const balance = account.currencyBalanceMap[currencyAddress];
        if (balance === undefined) { throw new Error(`Unknown accountAddress ${accountAddress}`); }

        account.currencyBalanceMap[currencyAddress] = new BigNumber(balance).minus(amount).toString();
    }

    @asyncAction
    public *init() {
        const [
            averageGasPrice,
            accountList,
            currencyList,
        ] = yield Promise.all([
            api.methods.getGasPrice(),
            api.methods.getAccountList(),
            api.methods.getCurrencyList(),
        ]);

        this.averageGasPrice = averageGasPrice;
        this.accountMap = listToMap(accountList);
        this.currencyMap = listToMap(currencyList);
    }
}

function listToMap<T extends IHasAddress>(map: T[]): IAddressMap<T> {
    const result: IAddressMap<T> = {};

    map.reduce(
        (acc: IAddressMap<T>, item: T) => {
            acc[item.address] = item;

            return acc;
        },
        result,
    );

    return result;
}
