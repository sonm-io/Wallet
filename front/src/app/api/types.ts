export interface IRawAccount {
    json: string;
    name: string;
    address: string;
}

export type TTransactionStatus = 'created' | 'processed' | 'fail' | 'success';

export interface  ISendTransaction {
    timestamp: number;
    fromAddress: string;
    toAddress: string;
    amount: string;
    currencyAddress: string;
    gasPrice: string;
    gasLimit: string;
}

export interface ISendTransactionResult extends ISendTransaction {
    fee?: string;
    confirmCount: number;
    status: string;
    timestamp: number;
    hash: string;
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
    symbol: string;
    decimals: number;
    name: string;
    address: string;
}

export interface ITxListFilter {
    currencyAddress?: string;
    toAddress?: string;
    fromAddress?: string;
    timeStart?: number;
    timeEnd?: number;
    query?: string;
}

export { IResult, IValidation, TResultPromise, IResponse } from 'ipc/types';
