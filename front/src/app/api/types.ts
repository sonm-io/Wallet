import { TUsdWeiPerSeconds, TSeconds } from 'app/entities/types';
import { IProfileBrief } from 'common/types/profile';

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
    hash: string;
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

export enum NetworkEnum {
    live = 'livenet',
    rinkeby = 'rinkeby',
}

export enum EnumProfileRole {
    undefined = 0,
    supplier = 1,
    customer = 2,
}

export interface IBenchmarkMap {
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
    networkOverlay: boolean;
    networkOutbound: boolean;
    networkIncoming: boolean;
}

export enum EnumOrderSide {
    buy = 1,
    sell = 2,
}

export enum EnumTransactionStatus {
    fail = '0x0',
    success = '0x1',
}

export enum EnumOrderStatus {
    unknown = 0,
    inactive = 1,
    active = 2,
}

export interface IOrder {
    id: string;
    orderSide: EnumOrderSide;
    creator: IProfileBrief;
    usdWeiPerSeconds: TUsdWeiPerSeconds;
    durationSeconds: TSeconds;
    orderStatus: EnumOrderStatus;
    benchmarkMap: Partial<IBenchmarkMap>;
}

export enum EnumDealStatus {
    Unknown = 0,
    Accepted,
    Closed,
}

export interface IDeal {
    id: string;
    supplier: IProfileBrief;
    consumer: IProfileBrief;
    masterID: string;
    askID: string;
    bidID: string;
    duration: number;
    price: string;
    status: EnumDealStatus;
    blockedBalance: string;
    totalPayout: string;
    startTime: number;
    endTime: number;
    benchmarkMap: IBenchmarkMap;
    timeLeft: number;
    changeRequests?: Array<IDealChangeRequest>;
}

export interface IKycValidator {
    id: string;
    level: number;
    name: string;
    url: string;
    fee: string;
    logo: string;
    description: string;
}

export interface IWorker {
    slaveId: string;
    confirmed: boolean;
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

export interface IDealComparableParams {
    price: string;
    duration: number;
}

export enum EnumChangeRequestStatus {
    Created = 1,
    Canceled = 2,
    Rejected = 3,
    Accepted = 4,
}

export interface IDealChangeRequest {
    id: string;
    requestType: EnumOrderSide;
    duration?: string;
    price?: string;
    status: EnumChangeRequestStatus;
}

export interface ISender {
    send: (messageType: string, payload?: any) => any;
}

export type TChangeRequestAction = (requestId: string) => void;

export { IResult, IValidation, TResultPromise, IResponse } from 'ipc/types';
