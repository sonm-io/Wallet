import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { IListResult } from 'app/api/types';
import { IAccountInfo } from 'common/types/account';
import { TypeEthereumAddress } from 'common/types/runtime/etherium-address';
import { ICurrencyInfo } from 'common/types/currency';

export interface IAccountItemView extends IAccountInfo {
    etherBalance: string;
    primaryTokenBalance: string;
    primaryTokenInfo: ICurrencyInfo;
}

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

export const emptyProfile: IProfileFull = Object.freeze({
    attributes: [],
    description: '',
    certificates: [],
    sellOrders: 0,
    buyOrders: 0,
    deals: 0,
    country: 'uk',
    logoUrl: '',
    name: '',
    address: '',
    status: EnumProfileStatus.anon,
});

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
