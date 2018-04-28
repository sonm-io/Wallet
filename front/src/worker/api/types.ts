import * as t from 'app/api/types';

export interface IDictionary {
    [index: string]: string;
}

export interface INodes {
    [index: string]: string;
}

export interface ITokens {
    [index: string]: t.ICurrencyInfo[];
}

export interface IPayload {
    [index: string]: any;
}

export interface IWalletJson {
    address: string;
    crypto: object;
}

export interface IAccounts {
    [address: string]: {
        json: IWalletJson;
        name: string;
        address: string;
    };
}

export interface IResponse {
    data?: any;
    validation?: object;
}

export * from 'app/api/types';
