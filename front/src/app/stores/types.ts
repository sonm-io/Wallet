import { OnlineStore } from './online-store';

export { OnlineStore } from './online-store';

import { IValidation, ISendTransaction, ICurrencyInfo } from 'app/api';

export interface IHasAddress {
    address: string;
}

export interface IAddressMap<T extends IHasAddress> {
    [address: string]: T;
}

export interface ISendFormValues {
    amountEther: string;
    gasPriceGwei: string;
    gasLimit: string;
    toAddress: string;
    fromAddress: string;
    currencyAddress: string;
    password: string;
}

export interface ISendValidation extends IValidation {
    password: string;
}

export interface IPasswordCache {
    [address: string]: string;
}

export type TGasPricePriority = 'low' | 'normal' | 'high';

export class WalletApiError extends Error {
    public method: Function;
    public code: string;
    public scope: OnlineStore;
    public args: any[];

    constructor(
        code: string,
        msg: string,
        scope: OnlineStore,
        method: Function,
        args: any[],
    ) {
        super(msg);

        this.code = code;
        this.scope = scope;
        this.args = args;
        this.method = method;
    }
}

export enum AlertType {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info',
}

export interface IAlert {
    id: string;
    type: AlertType;
    message: string;
}

export enum THistorySourceMode {
    wallet = 'wallet',
    market = 'market',
}

export interface IApiSend {
    getPrivateKey: (password: string, accountAddress: string) => void;
    send: (tx: ISendTransaction, password: string) => void;
}

export enum Status {
    PENDING,
    ERROR,
    DONE,
}

export interface IAccountItemView {
    address: string;
    json: string;
    name: string;
    etherBalance: string;
    usdBalance: string;
    marketBalance: string;
    primaryTokenBalance: string;
    primaryTokenInfo: ICurrencyInfo;
}

export interface ICurrencyItemView {
    address: string;
    name: string;
    symbol: string;
    balance: string;
    decimalPointOffset: number;
}
