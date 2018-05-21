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
            hashrate: '0 MH/s',
            ramSize: '1 MB',
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
            hashrate: '0 MH/s',
            ramSize: '5 MB',
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
            hashrate: '0 MH/s',
            ramSize: '5 MB',
        },
    },
];

export { data };
