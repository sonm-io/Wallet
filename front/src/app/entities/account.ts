import { IAccountInfo, ICurrencyBalanceMap } from 'common/types/account';
import { IProfileInfo } from 'common/types/profile';
import { IMarketStats } from 'app/api';

export interface IAccount {
    name: string;
    address: string;
    json: string;

    marketBalance: string;
    marketUsdBalance: string;
    currencyBalanceMap: ICurrencyBalanceMap;
    etherBalance: string;
    primaryTokenBalance: string;

    profile?: IProfileInfo;
    marketStats: IMarketStats;
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
        this.marketUsdBalance = data.marketUsdBalance; // ToDo a make computed
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

    public profile?: IProfileInfo;

    public marketStats: IMarketStats = {
        dealsCount: 0,
        dealsPrice: '0',
        daysLeft: 0,
    };
}
