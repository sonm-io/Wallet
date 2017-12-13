export interface IRawAccount {
    json: string;
    name: string;
    address: string;
}

export enum TransactionStatus {
    created = 'created',
    pending = 'pending',
    fail = 'fail',
    success = 'success',
}

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
    status: TransactionStatus;
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

export interface ISettings {
    chain_id: string;
    node_url: string;
    language: string;
}

export { IResult, IValidation, TResultPromise, IResponse } from 'ipc/types';
