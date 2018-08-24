import { BN } from 'bn.js';
import { IAccountInfo, ICurrencyBalanceMap } from 'common/types/account';
import { IProfileInfo } from 'common/types/profile';
import { IMarketStats } from 'app/api';

const emptyMarketStats: IMarketStats = Object.freeze({
    dealsCount: 0,
    dealsPrice: '0',
    daysLeft: 0,
});

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
    protected static WEI_PRECISION = Array(19).join('0');

    protected static toUsd = (value: string, rate: string) => {
        return parseInt(rate, 10) > 0
            ? new BN(value + Account.WEI_PRECISION).div(new BN(rate)).toString()
            : '0';
    };

    constructor(
        data: IAccountInfo,
        etherAddress: string,
        primaryTokenAddress: string,
        rate: string,
    ) {
        this.name = data.name;
        this.address = data.address;
        this.json = data.json;
        this.marketBalance = data.marketBalance;
        this.currencyBalanceMap = data.currencyBalanceMap;

        // computed properties:
        this.etherBalance = this.currencyBalanceMap[etherAddress];
        this.primaryTokenBalance = this.currencyBalanceMap[primaryTokenAddress];
        this.marketUsdBalance = Account.toUsd(this.marketBalance, rate);
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

    public marketStats: IMarketStats = { ...emptyMarketStats };
}

export const emptyAccount: IAccount = {
    name: '',
    address: '',
    json: '',

    marketBalance: '0',
    marketUsdBalance: '0',
    currencyBalanceMap: {},
    etherBalance: '0',
    primaryTokenBalance: '0',

    profile: undefined,
    marketStats: { ...emptyMarketStats },
};
