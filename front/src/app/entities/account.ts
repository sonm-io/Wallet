import { ICurrencyBalanceMap } from 'app/api/types';

export interface IAccountInfo {
    name: string;
    address: string;
    marketBalance: string;
    marketUsdBalance: string;
    currencyBalanceMap: ICurrencyBalanceMap;
    json: string;
}
