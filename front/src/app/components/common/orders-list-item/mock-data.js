const order = {
    id: '10012',
    orderType: 2,
    creator: {
        address: '0xF0FE2F10901CaFcCFd3Aa3aE960A561B88CCc3d6',
        name: '',
        status: 0,
    },
    price: '5799600',
    duration: 1.23,
    orderStatus: 2,
    benchmarkMap: {
        cpuCount: 6,
        gpuCount: 8,
        ethHashrate: 21.12,
        ramSize: 2594,
        cpuSysbenchMulti: 5401,
        cpuSysbenchOne: 10356,
        storageSize: 10,
        downloadNetSpeed: 10,
        uploadNetSpeed: 8,
        zcashHashrate: 283,
        redshiftGpu: 2,
        gpuRamSize: 1024,
        networkOverlay: false,
        networkOutbound: false,
        networkIncoming: false,
    },
};

module.exports = {
    order,
};
