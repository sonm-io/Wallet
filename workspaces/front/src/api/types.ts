export interface IResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ISubscribeResponse {
  success: boolean;
  done: boolean;
  data?: any;
  error?: string;
}

export interface IFormResponse extends IResponse {
  validation?: object;
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

export interface IBalanceResponse extends IResponse {
  data: {
    balance: string;
    token_balance: string;
  };
}
