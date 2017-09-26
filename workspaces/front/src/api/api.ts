const { ipcRenderer } = require('electron');

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
      type: 'login',
      payload,
    });
  });
}

export class Api {
  public async login(path: string, password: string): Promise<boolean> {
    return createPromise<boolean>(
      'login',
      { path, password },
    );
  }

  public async readPrivateKey() {
    let result: string;

    try {
      result = window.localStorage.getItem('private-key') || '';
    } catch (e) {
      result = '';
    }

    return result;
  }
}

const api = new Api();

export { api };
