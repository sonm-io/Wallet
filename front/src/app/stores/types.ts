import { AbstractStore } from './abstract-store';

export { AbstractStore } from './abstract-store';

import {
    IValidation,
} from 'app/api';

export interface IHasAddress {
    address: string;
}

export interface IAddressMap<T extends IHasAddress> {
    [address: string]: T;
}

export interface ISendFormValues {
    amount: string;
    gasPrice: string;
    gasLimit: string;
    toAddress: string;
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
    public scope: AbstractStore;
    public args: any[];

    constructor(
        code: string,
        msg: string,
        scope: AbstractStore,
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
