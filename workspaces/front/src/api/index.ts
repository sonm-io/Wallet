import { ipcRenderer } from 'electron';
export * from './types';
import * as t from './types';
import { messages, IValidation } from './error-messages';

const MAX_DELAY_DEFAULT = 10000;

let count = 0;
function nextRequestId(): string {
  return 'request' + count++;
}

function createPromise<TResult extends t.IFormResponse>(type: string, payload: any, maxDelay: number = MAX_DELAY_DEFAULT): Promise<TResult> {
  return new Promise((done, reject) => {
    const requestId = nextRequestId();
    let watchTask: any;

    const callback = (event: any, response: TResult) => {
      clearTimeout(watchTask);

      if (response.validation) {
        response.validation = processValidation(response.validation);
      }

      if (response.success) {
        done(response);
      } else {
        reject(response.error);
      }
    };

    watchTask = setInterval(
      () => {
        ipcRenderer.removeAllListeners(requestId);
        reject({ error: 'timeout' });
      },
      maxDelay,
    );

    ipcRenderer.once(requestId, callback);

    (ipcRenderer as any).send('sonm', {
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

  public async processTransaction(
    from: string,
    to: string,
    qty: string,
    currency: t.TCurrency,
    gasPrice?: string,
    gasLimit?: string,
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

  public static instance = new Api();
}

export const methods = Api.instance;
