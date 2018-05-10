import * as t from 'tcomb';
import { createStruct } from './utils/runtime-types-utils';

import {
    IProfileBrief,
    IListResult,
    IAttribute,
    IProfileFull,
    IOrder,
} from './types';

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

export const TypeAttribute = createStruct<IAttribute>(
    {
        label: t.String,
        value: t.String,
    },
    'IAttribute',
);

export const TypeProfileFull = TypeProfileBrief.extend<IProfileFull>(
    {
        attributes: t.list(TypeAttribute),
    },
    'IProfileFull',
);

export const TypeOrder = createStruct<IOrder>(
    {
        id: t.String,
        orderType: t.Number,
        price: t.String,
        duration: t.Number,
        orderStatus: t.Number,
        authorID: t.String,
    },
    'IOrder',
);

export const TypeOrderList = createStruct<IListResult<IOrder>>(
    {
        records: t.list(TypeOrder),
        total: t.Number,
    },
    'IListResult<IOrder>',
);
