import { ipcRenderer } from 'electron';
export * from './types';
import * as t from './types';

const MAX_DELAY_DEFAULT = 10000;

let count = 0;
function nextRequestId(): string {
  return 'request' + count++;
}

function createPromise<TResult>(type: string, payload: any, maxDelay: number = MAX_DELAY_DEFAULT): Promise<TResult> {
  return new Promise((done, reject) => {
    const requestId = nextRequestId();
    let watchTask: any;

    const callback = (response: TResult) => {
      clearTimeout(watchTask);
      done(response);
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
      'user.login',
      null,
    );
  }

  public async checkAuth(): Promise<boolean> {
    return Promise.resolve(true);
  }

  static instance = new Api();
}

export const methods = Api.instance;
