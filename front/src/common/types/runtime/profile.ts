import * as t from 'tcomb';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { TypeEthereumAddress } from './etherium-address';
import { IProfileBrief, IProfile, IProfileInfo } from '../profile';
import { IListResult } from 'common/types';
import { TypeProfileAttribute } from './profile-attribute';
import { TypeProfileCertifcate } from './profile-certificate';

export const TypeProfileBrief = createStruct<IProfileBrief>(
    {
        address: TypeEthereumAddress,
        name: t.String,
        status: t.Number,
    },
    'IAccountBrief',
);

export const TypeProfile = createStruct<IProfile>(
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

export const TypeProfileList = createStruct<IListResult<IProfile>>(
    {
        records: t.list(TypeProfile),
        total: t.Number,
    },
    'IListResult<IProfileBrief>',
);

export const TypeProfileInfo = createStruct<IProfileInfo>(
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
        certificates: t.list(TypeProfileCertifcate),
    },
    'IProfileFull',
);
