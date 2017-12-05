import { Request } from '../ipc/messages';
import * as sonmApi from 'sonm-api';
import * as AES from 'crypto-js/aes';
import * as SHA256 from 'crypto-js/sha256';
import * as Utf8 from 'crypto-js/enc-utf8';
import * as Hex from 'crypto-js/enc-hex';
import * as ipc from '../ipc/ipc';
import * as t from '../../app/api/types';

const { createSonmFactory, utils } = sonmApi;

const KEY_WALLETS_LIST = 'sonm_wallets';

interface IPayload {
    [index: string]: any;
}

interface IWalletJson {
    address: string;
    crypto: object;
}

interface IAccounts {
    [address: string]: {
        json: IWalletJson,
        name: string,
        address: string,
    };
}

interface IResponse {
    data?: any;
    validation?: object;
}

let count = 0;
function nextRequestId(): string {
    return 'request' + count++;
}

function createPromise(
    action: string,
    payload?: any,
): Promise<any> {
    return new Promise((resolve, reject) => {
        const reqId = nextRequestId();

        (ipc as any).send({
            reqId,
            type: 'storage',
            action,
            payload,
        });

        (ipc as any).listen((response: any) => {
            if (reqId === response.reqId) {
                resolve(response.data);
            }
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

    private storage: {
        [index: string]: any,
    };

    private secretKey: string;
    private hash: string;

    private constructor() {
        this.accounts = {};

        this.routes = {
            'ping': this.ping,
            'getWalletList': this.getWalletList,

            'account.add': this.addAccount,
            'account.remove': this.removeAccount,
            'account.rename': this.renameAccount,

            'account.getGasPrice': this.getGasPrice,
            'account.getCurrencyBalances': this.getCurrencyBalances,
            'account.getCurrencies': this.getCurrencies,
            'account.send': this.send,
            'account.list': this.getAccountList,

            'account.setSecretKey': this.setSecretKey,
            'account.hasSavedData': this.hasSavedData,

            'transaction.list': this.getTransactionList,
        };

        this.storage = {
            accounts: {},
            transactions: [],
        };
    }

    public decrypt = (data: string): any => {
        return data ? JSON.parse(AES.decrypt(data, this.secretKey).toString(Utf8)) : null;
    }

    public encrypt = (data: any): string => {
        return AES.encrypt(data ? JSON.stringify(data) : null, this.secretKey).toString();
    }

    public getWalletList = async (): Promise<IResponse> => {
        const list = await createPromise('get', { key: KEY_WALLETS_LIST });
        return {
            data: (list ? JSON.parse(list) : []),
        };
    }

    public hasSavedData = async (): Promise<IResponse> => {
        return {
            data: (await createPromise('get', { key: this.hash })) ? true : false,
        };
    }

    public setSecretKey = async (data: IPayload): Promise<IResponse> => {
        if (data.password && data.walletName) {

            this.secretKey = data.password;
            this.hash = `sonm_${SHA256(data.walletName).toString(Hex)}`;

            const dataFromStorage = await createPromise('get', { key: this.hash });

            if (dataFromStorage) {
                try {
                    this.storage = this.decrypt(dataFromStorage);

                    this.processPendingTransactions();

                    return {
                        data: true,
                    };
                } catch (err) {
                    return {
                        validation: {
                            password: 'password_not_valid',
                        },
                    };
                }
            } else {
                await this.saveData();

                // add wallet to list
                const walletList = (await this.getWalletList()).data;
                walletList.push(data.walletName);

                await createPromise('set', { key: KEY_WALLETS_LIST, value: JSON.stringify(walletList)});

                return {
                    data: true,
                };
            }
        } else {
            return {
                validation: {
                    password: 'password_empty',
                },
            };
        }
    }

    public getAccountList = async (): Promise<IResponse> => {
        const accounts = await this.getAccounts() || {};
        const addresses = Object.keys(accounts);

        const requests = [];
        for (const address of Object.keys(accounts)) {
            requests.push(this.getCurrencyBalances(address));
        }

        const balancies = await Promise.all(requests);

        const list = [] as t.IAccountInfo[];
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
        };
    }

    private saveData = async (): Promise<void> => {
        await createPromise('set', {
            key: this.hash,
            value: this.encrypt(this.storage),
        });
    }

    private getAccounts = async (): Promise<IAccounts | null> => {
        return this.storage.accounts || null;
    }

    public async ping(): Promise<IResponse> {
        return {
            data: {
                pong: true,
            },
        };
    }

    private async processPendingTransactions() {
        const factory = createSonmFactory(URL_REMOTE_GETH_NODE);

        for (const transaction of this.storage.transactions) {
            if (transaction.status === 'pending') {
                const txResult = factory.createTxResult(transaction.hash);
                this.proceedTx(transaction, txResult);
            }
        }
    }

    private async initAccount(address: string) {
        if (!this.accounts[address]) {
            const factory = createSonmFactory(URL_REMOTE_GETH_NODE);

            this.accounts[address] = {
                factory,
                account: await factory.createAccount(address),
                password: null,
            };
        }

        return this.accounts[address];
    }

    public getCurrencyBalances = async (address: string): Promise<any> => {
        const client = await this.initAccount(address);
        const balancies = await client.account.getCurrencyBalances();

        for (const address of Object.keys(balancies)) {
            balancies[address] = utils.fromWei(balancies[address], 'ether');
        }

        return balancies;
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

    public getGasPrice = async (): Promise<IResponse> => {
        const factory = createSonmFactory(URL_REMOTE_GETH_NODE);
        const gasPrice = (await factory.gethClient.getGasPrice()).toString();

        return {
            data: utils.fromWei(gasPrice, 'ether'),
        };
    }

    public addAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.json && data.password) {
            try {
                const json = JSON.parse(data.json);

                const accounts = await this.getAccounts() || {};
                const address = utils.add0x(json.address);

                if (!accounts[address]) {
                    const privateKey = await utils.recoverPrivateKey(json, data.password);

                    const client = await this.initAccount(json.address);
                    client.password = data.password;
                    client.factory.setPrivateKey(privateKey.toString('hex'));
                    accounts[address] = {
                        json,
                        address,
                        name: data.name,
                    };

                    await this.saveData();

                    return {
                        data: {
                            address,
                            name: data.name,
                            currencyBalanceMap: await this.getCurrencyBalances(address),
                        },
                    };
                } else {
                    throw new Error('account_exists');
                }
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
                await this.saveData();

                return {
                    data: true,
                };
            } else {
                throw new Error('account_not_found');
            }
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
                await this.saveData();

                return {
                    data: true,
                };
            } else {
                throw new Error('account_not_found');
            }
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

        const { fromAddress, toAddress, currencyAddress, password, gasLimit, timestamp } = data;

        const client = await this.initAccount(fromAddress);

        if (client && client.password) {
            if (client.password !== password) {
                throw new Error('password_not_matched');
            }
        } else {
            const accounts = await this.getAccounts() || {};

            try {
                const privateKey = await utils.recoverPrivateKey(accounts[fromAddress].json, password);
                client.factory.setPrivateKey(privateKey.toString('hex'));
                client.password = password;
            } catch (err) {
                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            }
        }

        const transactions = this.storage.transactions;
        const gasPrice = utils.toWei(data.gasPrice, 'ether');
        const amount = utils.toWei(data.amount, 'ether');

        const transaction = {
            timestamp,
            fromAddress,
            toAddress,
            amount: data.amount,
            currencyAddress,
            hash: null,
            fee: null,
            status: 'pending',
        };

        //await this.saveData();

        const txResult = (currencyAddress === '0x'
            ? await client.account.sendEther(
                toAddress,
                amount,
                gasLimit,
                gasPrice)
            : await client.account.sendTokens(
                toAddress,
                parseInt(amount, 10),
                currencyAddress,
                gasLimit,
                gasPrice,
            ));

        transactions.unshift(transaction);
        transaction.hash = await txResult.getHash();
        await this.saveData();
        await this.proceedTx(transaction, txResult);

        return {
            data: transaction,
        };
    }

    private async proceedTx(transaction: any, txResult: any) {
        const receipt = await txResult.getReceipt();
        console.log(receipt);

        const fee = await txResult.getTxPrice();

        transaction.status = 'success';
        transaction.fee = utils.fromWei(fee.toString(), 'ether');

        await this.saveData();
    }

    public getTransactionList = async (data: IPayload): Promise<IResponse> => {
        let { filters, limit, offset } = data;

        filters = filters || {};
        limit = limit || 10;
        offset = offset || 0;

        let filtered = [];
        for (const item of this.storage.transactions) {
            let ok = true;

            if (Object.keys(filters).length) {
                for (const type of ['fromAddress', 'toAddress', 'currencyAddress']) {
                    if (filters[type] && item[type] !== filters[type]) {
                        ok = false;
                    }
                }

                if (filters.timeStart && item.timestamp < filters.timeStart) {
                    ok = false;
                }

                if (filters.timeEnd && item.timestamp > filters.timeEnd) {
                    ok = false;
                }
            }

            if (ok === true) {
                filtered.push(item);
            }
        }

        filtered = filtered.slice(offset, offset + limit);

        return {
            data: [
                filtered,
                this.storage.transactions.length,
            ],
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
            return {
                data: false,
            };
        }
    }

    public static instance = new Api();
}

export const api = Api.instance;
