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

// async function delay(timeout: number) {
//     return new Promise((resolve, reject) => setTimeout(resolve, timeout));
// }

class MyLocalStorage {
    public storage: any;

    constructor() {
        this.storage = localStorage;
    }

    public async get(key: string): Promise<any> {
        const value = this.storage.getItem(key);

        if (value) {
            const response = await createPromise<t.IResponse>('decrypt', {
                data: value,
            });

            return JSON.parse(response.data);
        } else {
            return null;
        }
    }

    public async set(key: string, value: any): Promise<any> {
        const response = await createPromise<t.IResponse>('encrypt', {
            data: JSON.stringify(value),
        });

        this.storage.setItem(key, response.data);
    }
}

export class Api {
    private localStorage: MyLocalStorage;

    private constructor() {
        this.localStorage = new MyLocalStorage();
    }

    public async setSecretKey(key: string): Promise<t.IResponse> {
        return await createPromise<t.IResponse>('account.setSecretKey', { key });
    }

    public async addAccount(json: t.IWalletJson, password: string, name: string): Promise<t.IAccountCheckResponse> {
        const response = await createPromise<t.IAccountCheckResponse>('account.check', { json, password });

        if (response.success) {
            const accounts = await this.getAccounts();

            accounts[json.address] = {
                address: json.address,
                json,
                name: name || 'wallet',
            };

            await this.localStorage.set('accounts', accounts);
        }

        return response;
    }

    public async removeAccount(address: string): Promise<void> {
        const accounts = await this.getAccounts();

        if (accounts[address]) {
            delete accounts[address]
            await this.localStorage.set('accounts', accounts);
        }
    }

    public async renameAccount(address: string, name: string): Promise<void> {
        const accounts = await this.getAccounts();

        if (accounts[address]) {
            accounts[address].name = name;
            await this.localStorage.set('accounts', accounts);
        }
    }

    private async getAccounts(): Promise<t.IAccounts> {
        return await this.localStorage.get('accounts') as t.IAccounts;
    }

    public async getAccountList(): Promise<t.IAccountInfo[]> {
        const response1 = await createPromise<t.IResponse>('account.list', {});
        console.log('1111', response1);

        const response: t.IAccountInfo[] = [];

        const accounts = await this.getAccounts();

        for (const address of Object.keys(accounts)) {
            const balances = await this.getCurrencyBalances(address);

            const balanceMap: t.ICurrencyBalanceMap = {};

            for (const key of Object.keys(balances.data)) {
                 balanceMap[key] = balances.data[key];
            }

            response.push({
                address,
                name: accounts[address].name,
                currencyBalanceMap: balanceMap,
            });
        }

        //init transactons
        await createPromise<t.IResponse>('transaction.set', {
            transactions: await this.localStorage.get('transactions'),
        });

        return response;
    }

    public async getCurrencyBalances(address: string): Promise<t.IResponse> {
        return createPromise<t.IResponse>('account.getCurrencyBalances', { address });
    }

    public async getCurrencyList(): Promise<t.ICurrencyInfo[]> {
        const addresses = Object.keys(this.getAccounts());
        const response = await createPromise<t.IResponse>('account.getCurrencies', { address: addresses[0] });

        return response.data as t.ICurrencyInfo[];
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
        const accounts = await this.getAccounts();

        const response = await createPromise<t.IResponse>('account.send', {
            from,
            to,
            qty,
            gasPrice,
            gasLimit,
            currency,
            password,
            json: accounts[from].json,
        });

        //save transactions
        await this.localStorage.set('transactions', (await createPromise<t.IResponse>('transaction.get', {})).data || []);

        return response;
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
        return await createPromise<t.IResponse>('account.getGasPrice', {});
    }

    public static instance = new Api();
}

export const methods = Api.instance;
