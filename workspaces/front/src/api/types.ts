export interface IResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ILoginResponse extends IResponse {
  validation?: {
    path?: string;
    password?: string;
  };
  data?: {
    address: string;
  };
}

export interface IBalanceResponse extends IResponse {
  data: {
    balance: number;
  };
}
