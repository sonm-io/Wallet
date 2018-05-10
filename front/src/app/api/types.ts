export interface IRawAccount {
    json: string;
    name: string;
    address: string;
}

export enum TransactionStatus {
    created = 'created',
    pending = 'pending',
    failed = 'failed',
    success = 'success',
}

export interface ISendTransaction {
    timestamp: number;
    fromAddress: string;
    toAddress: string;
    amount: string;
    currencyAddress: string;
    gasPrice: string;
    gasLimit: string;
}

export interface ISendTransactionResult extends ISendTransaction {
    action?: string;
    currencySymbol: string;
    decimalPointOffset: number;
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
    json: string;
}

export interface ICurrencyBalanceMap {
    [address: string]: string; // address => balance
}

export interface ICurrencyInfo {
    symbol: string;
    decimalPointOffset: number;
    name: string;
    address: string;
    balance: string;
}

export interface ITxListFilter {
    currencyAddress?: string;
    toAddress?: string;
    fromAddress?: string;
    timeStart?: number;
    timeEnd?: number;
    query?: string;
}

export interface IListQuery<T = string> {
    limit: number;
    offset: number;
    sortBy?: string;
    sortDesc?: boolean;
    filter?: T;
}

export interface ISettings {
    chainId: string;
    nodeUrl: string;
    language: string;
}

export interface IWalletListItem {
    name: string;
    chainId: string;
    nodeUrl: string;
}

export interface IWalletList {
    version: number;
    data: IWalletListItem[];
}

export enum NetworkEnum {
    live = 'livenet',
    rinkeby = 'rinkeby',
}

export enum EnumProfileStatus {
    anonimest = 0,
    anon = 1,
    reg = 2,
    ident = 3,
    pro = 4,
}

export enum EnumProfileRole {
    customer = 1,
    supplier = 2,
}

export interface IAttribute {
    label: string;
    value: string;
}

export interface IProfileBrief {
    name: string;
    address: string;
    status: EnumProfileStatus;
    sellOrders: number;
    buyOrders: number;
    deals: number;
    country: string;
    logoUrl: string;
}

export interface IProfileFull extends IProfileBrief {
    attributes: Array<IAttribute>;
}

export interface IListResult<T> {
    records: Array<T>;
    total: number;
}

export interface IOrder {
    id: number;
    orderType: number;
    price: number;
    duration: number;
    orderStatus: number;
    authorID: string;
}

export interface IOrderListResult {
    records: IOrder[];
}

export interface IOrderListFilter {
    authorID?: string;
}

export interface ISender {
    send: (messageType: string, payload?: any) => any;
}

export { IResult, IValidation, TResultPromise, IResponse } from 'ipc/types';
