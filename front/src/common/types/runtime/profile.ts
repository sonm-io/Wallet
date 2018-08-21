import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { TypeEthereumAddress } from './etherium-address';
import { IAccountBrief, IProfileBrief, IProfileFull } from '../profile';
import { IListResult } from 'common/types';
import { TypeProfileAttribute } from './profile-attribute';
import { TypeCertifcate } from './profile-certificate';

export const TypeAccountBrief = createStruct<IAccountBrief>(
    {
        address: TypeEthereumAddress,
        name: t.String,
        status: t.Number,
    },
    'IAccountBrief',
);

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

export const TypeProfileFull = createStruct<IProfileFull>(
    {
        attributes: t.list(TypeProfileAttribute),
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
