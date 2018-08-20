import * as t from 'tcomb';
import { createStruct } from './utils/runtime-types-utils';

import {
    IListResult,
    IOrder,
    IDeal,
    IMarketStats,
    IOrderParams,
    IBenchmarkMap,
    IKycValidator,
    IWorker,
    IDealChangeRequest,
} from './types';
import { TypeAccountBrief } from 'app/entities/account';
import { isHexDeximal, isDigits } from 'common/utils';
import { TypeEthereumAddress } from 'common/types/runtime/etherium-address';

export const TypeNotStrictEthereumAddress = t.refinement(
    t.String,
    (s: string) =>
        (s.length === 42 && s.startsWith('0x') && isHexDeximal(s)) ||
        (s.length === 40 && isHexDeximal(s)),
    'EthereumAddress',
);

export const TypeBalance = t.refinement(t.String, isDigits);

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
        networkOverlay: t.Boolean,
        networkOutbound: t.Boolean,
        networkIncoming: t.Boolean,
    },
    'IBenchmarkMap',
);

export const TypeOrder = createStruct<IOrder>(
    {
        id: t.String,
        orderSide: t.Number,
        creator: TypeAccountBrief,
        usdWeiPerSeconds: t.String,
        durationSeconds: t.Number,
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

export const TypeDealChangeRequest = createStruct<IDealChangeRequest>(
    {
        id: t.String,
        price: t.maybe(t.String),
        duration: t.maybe(t.String),
        status: t.Number,
        requestType: t.Number,
    },
    'IDealChangeRequest',
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
        changeRequests: t.maybe(t.list(TypeDealChangeRequest)),
    },
    'IDeal',
);

export const TypeKycValidator = createStruct<IKycValidator>(
    {
        id: TypeEthereumAddress,
        level: t.Number,
        name: t.String,
        url: t.String,
        fee: t.String,
        logo: t.String,
        description: t.String,
    },
    'IKycValidator',
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

export const TypeWorker = createStruct<IWorker>(
    {
        slaveId: t.String,
        confirmed: t.Boolean,
    },
    'IWorker',
);

export const TypeWorkerList = createStruct<IListResult<IWorker>>(
    {
        records: t.list(TypeWorker),
        total: t.Number,
    },
    'IListResult<IWorker>',
);
