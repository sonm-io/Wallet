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
                console.log(response, 'request ', type);
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

class Storage {
    public storage: any;
    private secretKey: string;

    constructor(key: string) {
        this.storage = window.localStorage;
        this.secretKey = key;
    }

    public get(key: string): any {
        let result;
        const raw = this.storage.getItem(key);

        result = raw !== null
            ? JSON.parse(AES.decrypt(raw, this.secretKey).toString(Utf8))
            : result = null;

        return result;
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
    private storage: Storage | undefined;

    public setSecretKey(password: string) {
        this.storage = new Storage(password);
    }

    private get localStorage(): Storage {
        if (this.storage === undefined) {
            throw new Error('not initialized');
        }
        return this.storage;
    }

    public async addAccount(jsonRaw: string, password: string, name: string): Promise<t.IAccountCheckResponse> {
        const json = JSON.parse(jsonRaw);

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

    private getAccounts(): t.IRawAccountMap {
        return this.localStorage.get('accounts') || {};
    }

    public async getAccountList(): Promise<t.IAccountInfo[]> {
        const response: t.IAccountInfo[] = [];

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

        // init transactons
        // await createPromise<t.IResponse>('transaction.set', {
        //     transactions: this.localStorage.get('transactions'),
        // });

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

        // save transactions
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
        return createPromise<t.IResponse>('transaction.list', { filters, limit, offset});
    }

    public async getGasPrice(): Promise<t.IResponse> {
        return createPromise<t.IResponse>('account.getGasPrice', {});
    }

    public static instance = new Api();
}

export const methods = Api.instance;

Api.instance.setSecretKey('123'); // TODO

// (async () => {
//     await methods.addAccount(
//         `{"address":"88057f14236687831e1fd205e8efb9e45166fe72","crypto":{"cipher":"aes-128-ctr","ciphertext":"c5ba5234a2ee63ba3d6227ec76badc1c1b90d3cb89c67e6b3838b5ea151a871f","cipherparams":{"iv":"c0bba37aabca014fb2e167d950dda52e"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"4774e694dc2f374e5a1e78dba432a6af172f3cc58cf4283fa3e6b1d70a1ec1d5"},"mac":"7e91f97c19321c996c3fab95f52e35cd56172ac1de224bc224446ea0a8e33179"},"id":"c9356318-8835-413c-932e-4f9e3ad472f2","version":3}`,
//         '11111111',
//         'Vasya',
//     );
// })();
