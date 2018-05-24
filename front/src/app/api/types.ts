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
    marketBalance: string;
    marketUsdBalance: string;
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
    customer = 2,
    supplier = 1,
}

export interface IAttribute {
    label: string;
    value: string;
}

export interface IProfileBrief extends IAccountBrief {
    sellOrders: number;
    buyOrders: number;
    deals: number;
    country: string;
    logoUrl: string;
}

export interface IProfileFull extends IProfileBrief {
    attributes: Array<IAttribute>;
    description: string;
}

export interface IListResult<T> {
    records: Array<T>;
    total: number;
}

export interface IAccountBrief {
    name: string;
    address: string;
    status: EnumProfileStatus;
}

export interface IBenchmarkMap {
    [index: string]: string | number;
    cpuSysbenchMulti: number;
    cpuSysbenchOne: number;
    cpuCount: number;
    gpuCount: number;
    ethHashrate: number;
    ramSize: number;
    storageSize: number;
    downloadNetSpeed: number;
    uploadNetSpeed: number;
    gpuRamSize: number;
    zcashHashrate: number;
    redshiftGpu: number;
}

export interface IOrder {
    id: string;
    orderType: number;
    creator: IAccountBrief;
    price: string;
    duration: number;
    orderStatus: number;
    benchmarkMap: IBenchmarkMap;
}

export interface IDeal {
    id: string;
    supplier: IAccountBrief;
    consumer: IAccountBrief;
    masterID: string;
    askID: string;
    bidID: string;
    duration: number;
    price: string;
    status: number;
    blockedBalance: string;
    totalPayout: string;
    startTime: number;
    endTime: number;
    benchmarkMap: IBenchmarkMap;
    timeLeft: number;
}

export interface IOrderListFilter {
    authorID?: string;
}

export interface IDealListFilter {
    suppliedID?: string;
}

export interface IMarketStats {
    dealsCount: number;
    dealsPrice: string;
    daysLeft: number;
}

export interface IOrderParams {
    orderStatus: string;
    dealID: string;
}

export interface IDictionary {
    [index: string]: string | number;
}

export interface ISender {
    send: (messageType: string, payload?: any) => any;
}

export { IResult, IValidation, TResultPromise, IResponse } from 'ipc/types';
