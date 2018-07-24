const profile = {
    address: '0xF0FE2F10901CaFcCFd3Aa3aE960A561B88CCc3d6',
    name: '',
    status: 0,
};

const dealDetails = {
    price: '123',
    duration: '12',
    counterparty: '0xF0FE2F10901CaFcCFd3Aa3aE960A561B88CCc3d6',
    professional: false,
    registered: false,
    identified: false,
    anonymous: false,
    useBlacklist: false,
};

const resourceParams = {
    cpuCount: '6',
    gpuCount: '3',
    ramSize: '1024',
    storageSize: '1024',
    overlayAllowed: false,
    outboundAllowed: false,
    incomingAllowed: false,
    downloadSpeed: '',
    uploadSpeed: '',
    ethereumHashrate: '',
    zcashHashrate: '',
    redshiftBenchmark: '',
};

module.exports = {
    profile,
    dealDetails,
    resourceParams,
};
