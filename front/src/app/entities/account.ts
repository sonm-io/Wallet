import { IAccountInfo, ICurrencyBalanceMap } from 'common/types/account';

export interface IAccountItemView extends IAccountInfo {
    etherBalance: string;
    primaryTokenBalance: string;
}

export interface IAccount {
    name: string;
    address: string;
    json: string;

    marketBalance: string;
    marketUsdBalance: string;
    currencyBalanceMap: ICurrencyBalanceMap;
    etherBalance: string;
    primaryTokenBalance: string;
}

export class Account implements IAccount {
    constructor(
        data: IAccountInfo,
        etherAddress: string,
        primaryTokenAddress: string,
    ) {
        this.name = data.name;
        this.address = data.address;
        this.json = data.json;
        this.marketBalance = data.marketBalance;
        this.marketUsdBalance = data.marketUsdBalance;
        this.currencyBalanceMap = data.currencyBalanceMap;

        // computed properties:
        this.etherBalance = this.currencyBalanceMap[etherAddress];
        this.primaryTokenBalance = this.currencyBalanceMap[primaryTokenAddress];
    }

    public name: string = '';
    public address: string = '';
    public json: string = '';

    public marketBalance: string = '';
    public marketUsdBalance: string = '';
    public currencyBalanceMap: ICurrencyBalanceMap = {};

    public etherBalance: string;
    public primaryTokenBalance: string;
}
