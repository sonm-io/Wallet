import * as t from 'tcomb';
import { createStruct } from './utils/runtime-types-utils';

import {
    IProfileBrief,
    IListResult,
    IAttribute,
    IProfileFull,
    IAccountInfo,
    IOrder,
    IDeal,
} from './types';

const hexDeximalRegex = /^(0x)?[a-f0-9]+$/i;

const isHexDeximal = (x: string) => hexDeximalRegex.test(x);

const digitsRegex = /^[0-9]+$/;

const isDigits = (x: string) => digitsRegex.test(x);

export const TypeEthereumAddress = t.refinement(
    t.String,
    (s: string) => s.length === 42 && s.startsWith('0x') && isHexDeximal(s),
    'EthereumAddress',
);

export const TypeCurrencyAddress = t.refinement(
    t.String,
    (s: string) => s === '0x' || s === '0x1' || Boolean(TypeEthereumAddress(s)),
    'CurrencyAddress',
);

export const TypeBalance = t.refinement(t.String, isDigits);

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
    },
    'IProfileFull',
);

export const TypeCurrencyBalanceMap = t.irreducible(
    'CurrencyBalanceMap',
    (x: any) =>
        x !== null &&
        typeof x === 'object' &&
        Object.keys(x).every(
            key => Boolean(TypeCurrencyAddress(key)) && isDigits(x[key]),
        ),
);

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

export const TypeOrder = createStruct<IOrder>(
    {
        id: t.String,
        orderType: t.Number,
        price: t.String,
        duration: t.Number,
        orderStatus: t.Number,
        authorID: t.String,
        cpuCount: t.Number,
        gpuCount: t.Number,
        hashrate: t.Number,
        ramSize: t.Number,
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

export const TypeDeal = createStruct<IDeal>(
    {
        id: t.Number,
        supplierID: t.String,
        consumerID: t.String,
        masterID: t.String,
        askID: t.Number,
        bidID: t.Number,
        duration: t.Number,
        price: t.String,
        status: t.Number,
        blockedBalance: t.String,
        totalPayout: t.String,
    },
    'IDeal',
);

export const TypeDealList = createStruct<IListResult<IDeal>>(
    {
        records: t.list(TypeDeal),
        total: t.Number,
    },
    'IListResult<IDeal>',
);
