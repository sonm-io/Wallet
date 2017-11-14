import * as ipc from './ipc';
export * from './types';
import * as t from './types';
import { messages, IValidation } from './error-messages';

const MAX_DELAY_DEFAULT = 10000;

let count = 0;
function nextRequestId(): string {
  return 'request' + count++;
}

function createPromise<TResult extends t.IFormResponse>(
  type: string,
  payload: any,
  maxDelay: number = MAX_DELAY_DEFAULT)
: Promise<TResult> {
  return new Promise((done, reject) => {
    const requestId = nextRequestId();

    const callback = (event: any, response: TResult) => {
      if (response.validation) {
        response.validation = processValidation(response.validation);
      }

      if (response.success) {
        done(response);
      } else {
        reject(response.error);
      }
    };

    ipc.once(requestId, callback);

    (ipc as any).send('sonm', {
      requestId,
      type,
      payload,
    });
  });
}

function processValidation(obj: any): IValidation {
  return Object.keys(obj).reduce((acc: IValidation, key: string) => {
    acc[key] = messages[obj[key]];
    return acc;
  }, {});
}

async function delay(timeout: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, timeout));
}

export class Api {
  private constructor() {
  }

  public async login(path: string, password: string): Promise<t.ILoginResponse> {
    return createPromise<t.ILoginResponse>(
      'user.login',
      { path, password },
    );
  }

  public async readBalance(): Promise<t.IBalanceResponse> {
    return createPromise<t.IBalanceResponse>(
      'user.balance',
      null,
    );
  }

  public async send(
    from: string,
    to: string,
    qty: string,
    currency: string,
    gasPrice: string,
    gasLimit: string,
    password: string,
  ) {
    return createPromise<t.IBalanceResponse>(
      'user.send_ether',
      {
        from,
        to,
        qty,
        gasPrice,
        gasLimit,
        currency,
      },
    );
  }

  public async getAccountList(): Promise<t.IAccountInfo[]> {
    await delay(10);

    return [];
  }

  public async getCurrencyList(): Promise<t.ICurrencyInfo[]> {
    await delay(10);
    
    return [];
  }

  public async getGasPricePriorityMap(): Promise<t.IGasPricePriorityMap> {
    await delay(10);

    return {
      low: '10',
      normal: '1000',
      hight: '10000000',
    }
  } 

  public static instance = new Api();
}

export const methods = Api.instance;
