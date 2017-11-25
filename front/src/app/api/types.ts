export interface IWalletJson {
    address: string;
    crypto: object;
}

export interface IResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export interface IFormResponse extends IResponse {
    validation?: object;
}

export interface IAccountInfo {
    name: string;
    address: string;
    currencyBalanceMap?: ICurrencyBalanceMap;
}

export interface ICurrencyBalanceMap {
    [address: string]: string;
}

export interface ICurrencyInfo {
    symbol: string;
    name: string;
    address: string;
}

export interface IAccounts {
    [address: string]: {
        json: IWalletJson,
        name: string,
        address: string,
    };
}

export interface IAccountCheckResponse extends IFormResponse {
    success: boolean;
    error?: string;
    validation?: {
        path?: string;
        password?: string;
    };
}

export interface ISubscribeResponse {
    success: boolean;
    done: boolean;
    data?: any;
    error?: string;
}

export interface ILoginResponse extends IFormResponse {
    validation?: {
        path?: string;
        password?: string;
    };
    data?: {
        address: string;
    };
}

export interface IGasPricePriorityMap {
    low: string;
    normal: string;
    hight: string;
}
