import { IOrder } from 'app/api/types';

// Taken from ReactDevTool
const data: Array<IOrder> = [
    {
        id: '10',
        orderType: 1,
        creator: {
            address: '0x8125721C2413d99a33E351e1F6Bb4e56b6b633FD',
            name: '',
            status: 0,
        },
        price: '999999999999997200',
        duration: 4,
        orderStatus: 2,
        benchmarkMap: {
            cpuCount: 1,
            gpuCount: 0,
            ethHashrate: 0,
            ramSize: 0,
            cpuSysbenchMulti: 1000,
            cpuSysbenchOne: 800,
            storageSize: 0,
            downloadNetSpeed: 0,
            uploadNetSpeed: 0,
            zcashHashrate: 0,
            redshiftGpu: 0,
            gpuRamSize: 0,
        },
    },
    {
        id: '1057',
        orderType: 2,
        creator: {
            address: '0x8125721C2413d99a33E351e1F6Bb4e56b6b633FD',
            name: '',
            status: 0,
        },
        price: '999999999999997200',
        duration: 1,
        orderStatus: 2,
        benchmarkMap: {
            cpuCount: 4,
            gpuCount: 0,
            ethHashrate: 0,
            ramSize: 0,
            cpuSysbenchMulti: 68,
            cpuSysbenchOne: 30037,
            storageSize: 0,
            downloadNetSpeed: 0,
            uploadNetSpeed: 0,
            zcashHashrate: 0,
            redshiftGpu: 0,
            gpuRamSize: 0,
        },
    },
    {
        id: '1058',
        orderType: 2,
        creator: {
            address: '0x8125721C2413d99a33E351e1F6Bb4e56b6b633FD',
            name: '',
            status: 0,
        },
        price: '999999999999997200',
        duration: 1,
        orderStatus: 2,
        benchmarkMap: {
            cpuCount: 4,
            gpuCount: 0,
            ethHashrate: 0,
            ramSize: 5,
            cpuSysbenchMulti: 68,
            cpuSysbenchOne: 30037,
            storageSize: 0,
            downloadNetSpeed: 0,
            uploadNetSpeed: 0,
            zcashHashrate: 0,
            redshiftGpu: 0,
            gpuRamSize: 0,
        },
    },
];

export { data };
