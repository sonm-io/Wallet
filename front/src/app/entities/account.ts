import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { IListResult } from 'app/api/types';
import {
    TypeCurrencyBalanceMap,
    ICurrencyBalanceMap,
    TypeEthereumAddress,
} from './currency';

export interface IAccountInfo {
    name: string;
    address: string;
    marketBalance: string;
    marketUsdBalance: string;
    currencyBalanceMap: ICurrencyBalanceMap;
    json: string;
}

export const TypeAccountInfo = createStruct<IAccountInfo>(
    {
        address: TypeEthereumAddress,
        name: t.String,
        marketBalance: t.String,
        marketUsdBalance: t.String,
        currencyBalanceMap: TypeCurrencyBalanceMap,
        json: t.String,
    },
    'IAccountInfo',
);

export const TypeAccountInfoList = t.list(TypeAccountInfo);

export enum EnumProfileStatus {
    anonimest = 0,
    anon = 1,
    reg = 2,
    ident = 3,
    pro = 4,
}

export interface IAccountBrief {
    name?: string;
    address: string;
    status: EnumProfileStatus;
}

export const TypeAccountBrief = createStruct<IAccountBrief>(
    {
        address: TypeEthereumAddress,
        name: t.String,
        status: t.Number,
    },
    'IAccountBrief',
);

export interface IProfileBrief extends IAccountBrief {
    sellOrders: number;
    buyOrders: number;
    deals: number;
    country: string;
    logoUrl: string;
}

export const TypeProfileBrief = createStruct<IProfileBrief>(
    {
        address: t.String,
        status: t.Number,
        name: t.String,
        sellOrders: t.Number,
        buyOrders: t.Number,
        deals: t.Number,
        country: t.String,
        logoUrl: t.String,
    },
    'IProfileBrief',
);

export const TypeProfileList = createStruct<IListResult<IProfileBrief>>(
    {
        records: t.list(TypeProfileBrief),
        total: t.Number,
    },
    'IListResult<IProfileBrief>',
);

export interface ICertificate {
    status: EnumProfileStatus;
    address: string;
}

export const TypeCertifcate = createStruct<ICertificate>(
    {
        address: TypeEthereumAddress,
        status: t.Number,
    },
    'ICertificate',
);

export interface IAttribute {
    label: string;
    value: string;
}

export const TypeAttribute = createStruct<IAttribute>(
    {
        label: t.String,
        value: t.String,
    },
    'IAttribute',
);

export interface IProfileFull extends IProfileBrief {
    attributes: Array<IAttribute>;
    description: string;
    certificates: Array<ICertificate>;
}

export const TypeProfileFull = createStruct<IProfileFull>(
    {
        attributes: t.list(TypeAttribute),
        address: TypeEthereumAddress,
        status: t.Number,
        name: t.String,
        sellOrders: t.Number,
        buyOrders: t.Number,
        deals: t.Number,
        country: t.String,
        logoUrl: t.String,
        description: t.String,
        certificates: t.list(TypeCertifcate),
    },
    'IProfileFull',
);
