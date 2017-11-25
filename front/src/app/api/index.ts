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
    payload?: any,
    maxDelay: number = MAX_DELAY_DEFAULT,
): Promise<TResult> {
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

        (ipc as any).send({
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
    public async setSecretKey(key: string): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.setSecretKey', { key });
    }

    public async addAccount(json: string, password: string, name: string): Promise<t.IAccountCheckResponse> {
        return await createPromise<t.IAccountCheckResponse>('account.add', { json, password, name });
    }

    public async removeAccount(address: string): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.remove', { address });
    }

    public async renameAccount(address: string, name: string): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.rename', { address, name });
    }

    public async getAccountList(): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.list', {});
    }

    public async getCurrencyList(): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.getCurrencies');
    }

    public async ping(): Promise<t.IResponse> {
        return createPromise<t.IResponse>('ping', {ping: true});
    }

    public async getBalance(address: string) {
        return createPromise<t.IResponse>('account.getBalance', { address });
    }

    public async login(path: string, password: string): Promise<t.ILoginResponse> {
        return createPromise<t.ILoginResponse>('user.login', { path, password });
    }

    public async send(
        from: string,
        to: string,
        qty: string,
        currency: string,
        gasPrice: string,
        gasLimit: string,
        password: string,
    ): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.send', {
            from,
            to,
            qty,
            gasPrice,
            gasLimit,
            currency,
            password,
        });
    }

    public async getTransactionList(
        filters?: {
            currency?: string,
            to_address?: string,
            from_address?: string,
            date_start?: number,
            date_end?: number,
        },
        limit?: number,
        offset?: number,
    ): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('transaction.list', { filters, limit, offset});
    }

    public async getGasPrice(): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.getGasPrice');
    }

    public static instance = new Api();
}

export const methods = Api.instance;
