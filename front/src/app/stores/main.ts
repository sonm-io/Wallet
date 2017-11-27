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

    @observable public accountMap: IAddressMap<IAccountInfo>;

    @observable public currencyMap: IAddressMap<ICurrencyInfo>;

    @observable public selectedAccountAddress = '';

    @observable public selectedCurrencyAddress = '0x';

    @observable public userGasPrice = '';

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

    @computed public get sonmTokenAddress(): string {
        const result = Object.keys(this.currencyMap).find(
            addr => this.currencyMap[addr].symbol.toUpperCase() === 'SNMT',
        );

        if (result == null) { throw new Error('sonmTokenAddress not found'); }

        return result;
    }

    @computed public get etherTokenAddress(): string {
        const result =  Object.keys(this.currencyMap).find(
            addr => this.currencyMap[addr].symbol.toUpperCase() === 'ETH',
        );

        if (result == null) { throw new Error('etherTokenAddress not found'); }

        return result;
    }

    @computed public get accountList(): IAccountItemProps[] {
        if (this.accountMap === undefined || this.currencyMap === undefined) {
            return [];
        }

        const sonmTokenAddress = this.sonmTokenAddress;
        const etherTokenAddress = this.etherTokenAddress;

        const result = Object.keys(this.accountMap).map(accountAddr => {
            return {
                address: accountAddr,
                name: this.accountMap[accountAddr].name,
                sonmBalance: this.accountMap[accountAddr].currencyBalanceMap[sonmTokenAddress],
                etherBalance: this.accountMap[accountAddr].currencyBalanceMap[etherTokenAddress],
            };
        });

        return sortByName(result) as IAccountItemProps[];
    }

    private getBalanceListFor(...accounts: string[]): ICurrencyItemProps[] {
        if (this.accountMap === undefined || this.currencyMap === undefined) {
            return [];
        }

        const result = Object.keys(this.currencyMap).map((currencyAddr: string): ICurrencyItemProps => {
            const currency = this.currencyMap[currencyAddr];

            return {
                name: currency.name,
                symbol: currency.symbol,
                balance: accounts.reduce((sum: any, accountAddr: string) => {
                    sum = sum.plus(this.accountMap[accountAddr].currencyBalanceMap[currencyAddr]);

                    return sum;
                }, new BigNumber(0)).toString(),
                address: currencyAddr,
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
    public decreaseBalance(accountAddress: string, currencyAddress: string, amount: string) {
        const account = this.accountMap[accountAddress] as IAccountInfo;
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

    @asyncAction
    public *init() {
        const result = yield Promise.all([
            Api.getGasPrice(),
            Api.getAccountList(),
            Api.getCurrencyList(),
        ]);

        result.forEach((x: any) => {
            if (x instanceof Error) {
                throw x;
            }
        });

        const [
            { data: averageGasPrice },
            { data: accountList },
            { data: currencyList },
        ] = result;

        this.averageGasPrice = averageGasPrice;
        this.userGasPrice = averageGasPrice;
        this.accountMap = listToMap(accountList);
        this.currencyMap = listToMap(currencyList);

        if (this.selectedAccountAddress === '') {
            this.selectedAccountAddress = this.accountList[0].address;
        }
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
