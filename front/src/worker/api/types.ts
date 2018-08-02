import * as t from 'app/api/types';

export interface IDictionary {
    [index: string]: string | null;
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

export interface IResponse<T = any> {
    data?: T;
    validation?: IDictionary;
}

export class Response<T> implements IResponse<T> {
    public data?: T;
    public validation?: IDictionary;

    constructor(data: T, validation?: IDictionary) {
        this.data = data;
        this.validation = validation;
    }
}

export enum EnumAttributes {
    Kyc2 = 1201,
    Kyc3 = 1301,
    Kyc4 = 1401,
    Logo = 1302,
    Name = 1102,
    Website = 1202,
    Phone = 2201,
    Country = 1303,
    Email = 2202,
    SocNet = 2203,
    IsCorporation = 1304,
    Description = 1103,
    KycUrl = 1104,
    KycIcon = 1105,
    KycPrice = 1106,
}

export * from 'app/api/types';
