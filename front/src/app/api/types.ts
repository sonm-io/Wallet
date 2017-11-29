export interface IRawAccount {
    json: string;
    name: string;
    address: string;
}

export interface ISendTransactionParams {
    fromAddress: string;
    toAddress: string;
    amount: string;
    currencyAddress: string;
    gasPrice: string;
    gasLimit: string;
    password: string;
}

export interface ISendTransactionResult {
    timestamp: number;
    fromAddress: string;
    toAddress: string;
    amount: string;
    fee: string;
    currencyAddress: string;
    confirmCount: number;
}

export interface IAccountInfo {
    name: string;
    address: string;
    currencyBalanceMap: ICurrencyBalanceMap;
}

export interface ICurrencyBalanceMap {
    [address: string]: string; // address => balance
}

export interface ICurrencyInfo {
    symbol: string,
    decimals: number,
    name: string;
    address: string;
}

export { IResult, IValidation, TResultPromise } from 'ipc/types';
