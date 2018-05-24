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
    IMarketStats,
    IOrderParams,
    IAccountBrief,
    IBenchmarkMap,
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

export const TypeAccountBrief = createStruct<IAccountBrief>(
    {
        address: TypeEthereumAddress,
        name: t.String,
        status: t.Number,
    },
    'IAccountInfo',
);

export const TypeBenchmarkMap = createStruct<IBenchmarkMap>(
    {
        cpuCount: t.Number,
        gpuCount: t.Number,
        ethHashrate: t.Number,
        ramSize: t.Number,
        cpuSysbenchMulti: t.Number,
        cpuSysbenchOne: t.Number,
        storageSize: t.Number,
        downloadNetSpeed: t.Number,
        uploadNetSpeed: t.Number,
        zcashHashrate: t.Number,
        redshiftGpu: t.Number,
        gpuRamSize: t.Number,
    },
    'IBenchmarkMap',
);

export const TypeAccountInfoList = t.list(TypeAccountInfo);

export const TypeOrder = createStruct<IOrder>(
    {
        id: t.String,
        orderType: t.Number,
        creator: TypeAccountBrief,
        price: t.String,
        duration: t.Number,
        orderStatus: t.Number,
        benchmarkMap: TypeBenchmarkMap,
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
        id: t.String,
        supplier: TypeAccountBrief,
        consumer: TypeAccountBrief,
        masterID: t.String,
        askID: t.String,
        bidID: t.String,
        duration: t.Number,
        price: t.String,
        status: t.Number,
        blockedBalance: t.String,
        totalPayout: t.String,
        startTime: t.Number,
        endTime: t.Number,
        benchmarkMap: TypeBenchmarkMap,
        timeLeft: t.Number,
    },
    'IDeal',
);

export const TypeDealStats = createStruct<IMarketStats>(
    {
        dealsCount: t.Number,
        dealsPrice: t.String,
        daysLeft: t.Number,
    },
    'IMarketStats',
);

export const TypeOrderParams = createStruct<IOrderParams>(
    {
        orderStatus: t.String,
        dealID: t.String,
    },
    'IOrderParams',
);

export const TypeDealList = createStruct<IListResult<IDeal>>(
    {
        records: t.list(TypeDeal),
        total: t.Number,
    },
    'IListResult<IDeal>',
);
