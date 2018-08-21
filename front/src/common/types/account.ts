export interface ICurrencyBalanceMap {
    [address: string]: string; // address => balance
}

export interface IAccountInfo {
    name: string;
    address: string;
    json: string;

    marketBalance: string;
    marketUsdBalance: string;
    currencyBalanceMap: ICurrencyBalanceMap;
}
