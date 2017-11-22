import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';

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
    private secretKey: string;

    constructor(key: string) {
        this.storage = localStorage;
        this.secretKey = key;
    }

    public get(key: string): any {
        return JSON.parse(AES.decrypt(this.storage.getItem(key) || null, this.secretKey).toString(Utf8));
    }

    public set(key: string, value: any) {
        this.storage.setItem(key, AES.encrypt(JSON.stringify(value), this.secretKey).toString());
    }

    public addToValue(key: string, value: any) {
        const data = this.get(key);
        data.push(value);

        this.set(key, value);
    }
}

export class Api {
    private localStorage: MyLocalStorage;

    private constructor() {
        this.localStorage = new MyLocalStorage('my secret key');
    }

    public async addAccount(json: t.IWalletJson, password: string, name: string): Promise<t.IAccountCheckResponse> {
        const response = await createPromise<t.IAccountCheckResponse>('account.check', { json, password });

        if (response.success) {
            const accounts = this.getAccounts();

            accounts[json.address] = {
                address: json.address,
                json,
                name: name || 'wallet',
            };

            this.localStorage.set('accounts', accounts);
        }

        return response;
    }

    public async removeAccount(address: string): Promise<void> {
        const accounts = this.getAccounts();

        if (accounts[address]) {
            delete accounts[address]
            this.localStorage.set('accounts', accounts);
        }
    }

    public async renameAccount(address: string, name: string): Promise<void> {
        const accounts = this.getAccounts();

        if (accounts[address]) {
            accounts[address].name = name;
            this.localStorage.set('accounts', accounts);
        }
    }

    private getAccounts(): t.IAccounts {
        return this.localStorage.get('accounts') || {};
    }

    public async getAccountList(): Promise<t.IAccountInfo[]> {
        let response: t.IAccountInfo[] = [];

        const accounts = this.getAccounts();

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
            transactions: this.localStorage.get('transactions'),
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
        const accounts = this.getAccounts();

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
        this.localStorage.set('transactions', (await createPromise<t.IResponse>('transaction.get', {})).data || []);

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
