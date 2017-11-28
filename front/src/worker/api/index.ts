import { Request } from '../ipc/messages';
import * as sonmApi from 'sonm-api';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import * as ipc from '../ipc/ipc';
import * as t from '../../app/api/types';

const { createSonmFactory, utils } = sonmApi;

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

            'account.add': this.addAccount,
            'account.remove': this.removeAccount,
            'account.rename': this.renameAccount,

            'account.getGasPrice': this.getGasPrice,
            'account.getCurrencyBalances': this.getCurrencyBalances,
            'account.getCurrencies': this.getCurrencies,
            'account.send': this.send,
            'account.list': this.getAccountList,
            'account.setSecretKey': this.setSecretKey,

            'transaction.list': this.getTransactionList,
        };

        this.transactions = [];
    }

    public decrypt = (data: string): any => {
        return data ? JSON.parse(AES.decrypt(data, this.secretKey).toString(Utf8)) : null;
    }

    public encrypt = (data: any): string => {
        return AES.encrypt(data ? JSON.stringify(data) : null, this.secretKey).toString();
    }

    public setSecretKey = async (data: IPayload): Promise<IResponse> => {
        this.secretKey = data.key;
        return {};
    }

    public getAccountList = async (): Promise<IResponse> => {
        const accounts = await this.getAccounts() || {};
        const addresses = Object.keys(accounts);

        const requests = [];
        for (const address of Object.keys(accounts)) {
            requests.push(this.getCurrencyBalances(address));
        }

        const balancies = await Promise.all(requests);

        const list = [];
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];

            list.push({
                address,
                name: accounts[address].name,
                currencyBalanceMap: balancies[i],
            });
        }

        return {
            data: list,
        } as IResponse;
    }

    private saveData = async (key: string, data: any): Promise<void> => {
        const encryptedData = await this.encrypt(data);

        await createPromise('set', {
            key,
            value: encryptedData,
        });
    }

    private getAccounts = async (): Promise<t.IAccounts | null> => {
        const data = await createPromise('get', { key: 'accounts' });

        if (data) {
            return this.decrypt(data) as t.IAccounts;
        } else {
            return null;
        }
    }

    public async ping(): Promise<IResponse> {
        return {
            data: {
                pong: true,
            },
        };
    }

    private async initAccount(address: string) {
        if (!this.accounts[address]) {
            const geth = createSonmFactory(URL_REMOTE_GETH_NODE, address);

            this.accounts[address] = {
                geth,
                account: await geth.createAccount(),
                password: null,
            };
        }

        return this.accounts[address];
    }

    public getCurrencyBalances = async (address: string): Promise<any> => {
        const client = await this.initAccount(address);
        return await client.account.getCurrencyBalances();
    }

    public getCurrencies = async (data: IPayload): Promise<IResponse> => {
        const accounts = await this.getAccounts() || {};

        if (accounts) {
            const client = await this.initAccount(Object.keys(accounts)[0]);

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

    public addAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.json && data.password) {
            try {
                const json = JSON.parse(data.json);
                const privateKey = await utils.recoverPrivateKey(json, data.password);

                const account = await this.initAccount(json.address);
                account.password = data.password;
                account.geth.setPrivateKey(privateKey.toString('hex'));

                const accounts = await this.getAccounts() || {};
                const address = `0x${json.address}`;
                accounts[address] = {
                    json,
                    address,
                    name: data.name,
                };

                await this.saveData('accounts', accounts);

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

    public renameAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.address && data.name) {
            const accounts = await this.getAccounts() || {};
            if (accounts[data.address]) {
                accounts[data.address].name = data.name;
                await this.saveData('accounts', accounts);
            }

            return {};
        } else {
            throw new Error('required_params_missed');
        }
    }

    public removeAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.address) {
            const address = data.address;
            const accounts = await this.getAccounts() || {};

            if (accounts[address]) {
                delete accounts[address];
                await this.saveData('accounts', accounts);
            }

            return {};
        } else {
            throw new Error('required_params_missed');
        }
    }

    public getTransactions = async () => {
        const data = await createPromise('get', { key: 'transactions' });

        if (data) {
            return this.decrypt(data) || [];
        } else {
            return [];
        }
    }

    public send = async (data: IPayload): Promise<IResponse> => {
        const { from, to, qty, currency, password, gasPrice, gasLimit } = data;

        const gethClient = await this.initAccount(from);

        if (gethClient && gethClient.password) {
            if (gethClient.password !== password) {
                throw new Error('password_not_matched');
            }
        } else {
            const accounts = await this.getAccounts() || {};

            try {
                const privateKey = await utils.recoverPrivateKey(accounts[from].json, password);
                gethClient.geth.setPrivateKey(privateKey.toString('hex'));
                gethClient.password = password;
            } catch (err) {
                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            }
        }

        const transactions = await this.getTransactions();
        const count = transactions.length;

        await this.saveData('transactions', transactions);

        const txResult = (currency === '0x'
            ? await gethClient.account.sendEther(to, qty, gasLimit, gasPrice)
            : await gethClient.account.sendTokens(to, parseInt(qty, 10), currency, gasLimit, gasPrice));

        // presave
        transactions[count] = {
            hash: await txResult.getHash(),
            datetime: new Date().valueOf(),
            from_address: from,
            to_address: to,
            qty,
            currency,
        };

        const receipt = await txResult.getReceipt();
        const fee = await txResult.getTxPrice();

        transactions[count].fee = fee.toString();

        await this.saveData('transactions', transactions);

        return {
            data: receipt,
        };
    }

    public getTransactionList = async (data: IPayload): Promise<IResponse> => {
        let { filters, limit, offset } = data;

        filters = filters || {};
        limit = limit || 10;
        offset = offset || 0;

        const transactions = await this.getTransactions();
        let filtered = [];

        for (const item of transactions) {
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
                filtered.push(item);
            }
        }

        filtered = filtered.slice(offset, offset + limit);

        return {
            data: filtered,
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
