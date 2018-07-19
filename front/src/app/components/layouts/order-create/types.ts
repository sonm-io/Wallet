interface IDealDetails {
    price: string;
    duration: string;
    counterparty: string;
    professional: boolean;
    registered: boolean;
    identified: boolean;
    anonymous: boolean;
    useBlacklist: boolean;
}

interface IResourceParams {
    cpuCount: string;
    gpuCount: string;
    ramSize: string;
    storageSize: string;
    overlayAllowed: boolean;
    outboundAllowed: boolean;
    incomingAllowed: boolean;
    downloadSpeed: string;
    uploadSpeed: string;
    ethereumHashrate: string;
    zcashHashrate: string;
    redshiftBenchmark: string;
}

export type IOrderCreateParams = IDealDetails & IResourceParams;

export type IOrderCreateValidation = Partial<
    { [P in keyof IOrderCreateParams]: string }
>;
