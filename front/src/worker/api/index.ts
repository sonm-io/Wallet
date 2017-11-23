import { Request } from '../ipc/messages';
import * as sonmApi from 'sonm-api';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import * as ipc from '../ipc/ipc';

const { createClient, utils } = sonmApi;

interface IPayload {
    [index: string]: any;
}

interface IResponse {
    data?: object;
    validation?: object;
}

interface ITransaction {
    [index: string]: any;
    hash: string;
    datetime: number;
    from_address: string;
    to_address: string;
    qty: string;
    currency: string;
    fee: string;
}

function createPromise(
    action: string,
    payload: any,
): Promise<any> {
    return new Promise((resolve, reject) => {
        (ipc as any).send({
            type: 'storage',
            action,
            payload,
        });

        (ipc as any).listen((response: any) => {
            resolve(response.data);
        });
    });
}

const URL_REMOTE_GETH_NODE = 'https://rinkeby.infura.io';

class Api {
    private routes: {
        [index: string]: any,
    };

    private accounts: {
        [index: string]: any,
    };

    public transactions: ITransaction[];

    private secretKey: string;

    private constructor() {
        this.accounts = {};

        this.routes = {
            'ping': this.ping,

            'account.check': this.checkAccount,
            'account.getBalance': this.getBalance,
            'account.getGasPrice': this.getGasPrice,
            'account.getCurrencyBalances': this.getCurrencyBalances,
            'account.getCurrencies': this.getCurrencies,
            'account.send': this.send,
            'account.list': this.getAccountList,
            'account.setSecretKey': this.setSecretKey,

            'transaction.list': this.getTransactionList,
            'transaction.set': this.setTransactions,
            'transaction.get': this.getTransactions,

            'decrypt': this.decrypt,
            'encrypt': this.encrypt,
        };

        this.transactions = [];
    }

    public decrypt = async (payload: IPayload): Promise<IResponse> => {
        return {
            data: AES.decrypt(payload.data, this.secretKey).toString(Utf8),
        };
    }

    public encrypt = async (payload: IPayload): Promise<IResponse> => {
        return {
            data: AES.encrypt(payload.data, this.secretKey).toString(),
        };
    }

    public setSecretKey = async (data: IPayload): Promise<IResponse> => {
        this.secretKey = data.key;
        return {};
    }

    public async getAccountList(): Promise<IResponse> {
        const accounts = await this.getAccounts();

        console.log(accounts);

        return {
            data: {},
        };
    }

    private async getAccounts(): Promise<t.IAccounts> {
        const accounts = await createPromise('get', { key: 'accounts' });

        return await this.decrypt(accounts) as t.IAccounts;
    }

    public async ping(): Promise<IResponse> {
        return {
            data: {
                pong: true,
            },
        };
    }

    public setTransactions = async (data: IPayload): Promise<IResponse> => {
        if (data.transactions) {
            this.transactions = data.transactions;
        }

        return {};
    }

    public getTransactions = async (): Promise<IResponse> => {
        return {
            data: this.transactions,
        };
    }

    private async initAccount(address: string) {
        if (!this.accounts[address]) {
            const client = createClient(URL_REMOTE_GETH_NODE, address);

            this.accounts[address] = {
                client,
                account: await client.createAccount(),
                password: null,
            };
        }

        return this.accounts[address];
    }

    public getBalance = async (data: IPayload): Promise<IResponse> => {
        if (data.address) {
            const client = await this.initAccount(data.address);

            return {
                data: await client.account.getBalance(),
            };
        } else {
            throw new Error('required_params_missed');
        }
    }

    public getCurrencyBalances = async (data: IPayload): Promise<IResponse> => {
        if (data.address) {
            const client = await this.initAccount(data.address);

            return {
                data: await client.account.getCurrencyBalances(),
            };
        } else {
            throw new Error('required_params_missed');
        }
    }

    public getCurrencies = async (data: IPayload): Promise<IResponse> => {
        if (data.address) {
            const client = await this.initAccount(data.address);

            return {
                data: await client.account.getCurrencies(),
            };
        } else {
            throw new Error('required_params_missed');
        }
    }

    public getGasPrice = async (data: IPayload): Promise<IResponse> => {
        const client = this.accounts[Object.keys(this.accounts)[0]];

        return {
            data: (await client.account.getGasPrice()).toString(),
        };
    }

    public checkAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.json && data.password) {
            try {
                const privateKey = await utils.recoverPrivateKey(data.json, data.password);

                const account = await this.initAccount(data.address);
                account.password = data.password;

                const gethClient = await this.initAccount(data.address);
                gethClient.client.setPrivateKey(privateKey.toString('hex'));

                return {};
            } catch (err) {
                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            }
        } else {
            throw new Error('required_params_missed');
        }
    }

    public send = async (data: IPayload): Promise<IResponse> => {
        const { from, to, qty, currency, password, json } = data;

        const gethClient = await this.initAccount(from);

        if (gethClient && gethClient.password) {
            if (gethClient.password !== password) {
                throw new Error('password_not_matched');
            }
        } else {
            const privateKey = await utils.recoverPrivateKey(json, password);
            gethClient.client.setPrivateKey(privateKey.toString('hex'));
            gethClient.password = password;
        }

        const txResult = (currency === '0x'
            ? await gethClient.account.sendEther(to, qty)
            : await gethClient.account.sendTokens(to, parseInt(qty, 10), currency));
        const receipt = await txResult.getReceipt();
        const fee = await txResult.getTxPrice();

        this.transactions.push({
            hash: receipt.transactionHash,
            datetime: new Date().valueOf(),
            from_address: from,
            to_address: to,
            qty,
            currency,
            fee: fee.toString(),
        });

        return {
            data: receipt,
        };
    }

    public getTransactionList = async (data: IPayload): Promise<IResponse> => {
        let { filters, limit, offset } = data;

        filters = filters || {};
        limit = limit || 10;
        offset = offset || 0;

        const transactions = [];

        for (const item of this.transactions) {
            let ok = true;

            if (Object.keys(filters).length) {
                for (const type of ['from_address', 'to_address', 'currency']) {
                    if (filters[type] && item[type] !== filters[type]) {
                        ok = false;
                    }
                }

                if (filters.date_start && item.datetime < filters.date_start) {
                    ok = false;
                }

                if (filters.date_end && item.datetime > filters.date_end) {
                    ok = false;
                }
            }

            if (ok === true) {
                transactions.push(item);
            }
        }

        return {
            data: transactions,
        };
    }

    public async resolve(request: Request): Promise<IResponse> {
        if (this.routes[request.type]) {
            try {
                return await this.routes[request.type](request.payload);
            } catch (err) {
                throw new Error(err);
            }
        } else {
            throw new Error('wrong_route');
        }
    }

    public static instance = new Api();
}

export const api = Api.instance;
