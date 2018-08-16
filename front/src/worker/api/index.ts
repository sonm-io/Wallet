import * as sonmApi from 'sonm-api';
import * as AES from 'crypto-js/aes';
import * as SHA256 from 'crypto-js/sha256';
import * as Utf8 from 'crypto-js/enc-utf8';
import * as Hex from 'crypto-js/enc-hex';
import * as t from './types';
import { delay } from 'app/utils/async-delay';
import * as tcomb from 'tcomb';
import { BN } from 'bn.js';

import { wrapInResponse } from './utils';

import { migrate } from '../migrations';
import { DWH } from './dwh';

const { createSonmFactory, utils } = sonmApi;

const STORAGE_VERSION = 3;
const KEY_WALLETS_LIST = 'sonm_wallets';
const PENDING_HASH = 'waiting for hash...';

import ipc from '../ipc';
import { ICurrencyInfo } from 'app/entities/currency';
import { IAccountInfo } from 'app/entities/account';
import { Wallet } from 'app/entities/wallet';
import { DEFAULT_NODES } from './default-nodes';

async function ipcSend(type: string, payload?: any): Promise<any> {
    const res = await ipc.send(type, payload);
    return res.data || null;
}

const ZERO_ADDRESS = Array(41).join('0');
const WEI_PRECISION = Array(19).join('0');

const DEFAULT_TOKENS: t.ITokens = {
    livenet: [
        {
            name: 'STORJ',
            decimalPointOffset: 18,
            symbol: 'STORJ',
            address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
            balance: '0',
        },
    ],
    rinkeby: [
        {
            name: 'PIG',
            decimalPointOffset: 18,
            symbol: 'PIG',
            address: '0x917cc8f2180e469c733abc67e1b36b0ab3aeff60',
            balance: '0',
        },
    ],
    testrpc: [
        {
            name: 'PIG',
            decimalPointOffset: 18,
            symbol: 'PIG',
            address: '0x917cc8f2180e469c733abc67e1b36b0ab3aeff60',
            balance: '0',
        },
    ],
};

class Api {
    protected routes: {
        [index: string]: any;
    };

    private accounts: {
        [index: string]: any;
    } = {};

    private storage: {
        [index: string]: any;
    } = {
        accounts: {},
        transactions: [],
        tokens: [],
        settings: {
            chainId: null,
            nodeUrl: null,
        },
    };

    private secretKey: string = '';
    private hash: string = '';

    private tokenList: {
        [index: string]: any;
    } = {};

    private dwh: DWH;

    constructor(dwh: DWH) {
        this.dwh = dwh;

        this.routes = {
            ping: this.ping,
            getWalletList: this.getWalletList,
            checkConnection: this.checkConnection,

            getSettings: this.getSettings,
            setSettings: this.setSettings,

            createWallet: this.createWallet,
            unlockWallet: this.unlockWallet,
            importWallet: this.importWallet,
            exportWallet: this.exportWallet,

            'account.add': this.addAccount,
            'account.create': this.createAccount,
            'account.createFromPrivateKey': this.createAccountFromPrivateKey,
            'account.remove': this.removeAccount,
            'account.rename': this.renameAccount,

            'account.getGasPrice': this.getGasPrice,
            'account.getCurrencyBalances': this.getCurrencyBalances,
            'account.getCurrencies': this.getCurrencies,
            'account.getMarketBalance': this.getMarketBalance,
            'account.send': this.transaction('wallet'),
            'account.deposit': this.transaction('deposit'),
            'account.withdraw': this.transaction('withdraw'),
            'account.list': this.getAccountList,
            'account.requestTestTokens': this.requestTestTokens,
            'account.getPrivateKey': this.getPrivateKey,

            'transaction.list': wrapInResponse(this.getTransactionList),

            'profile.get': wrapInResponse(dwh.getProfileFull),
            'profile.list': wrapInResponse(dwh.getProfiles),
            'order.get': wrapInResponse(dwh.getOrderFull),
            'order.list': wrapInResponse(dwh.getOrders),
            'deal.get': wrapInResponse(dwh.getDealFull),
            'deal.list': wrapInResponse(dwh.getDeals),
            'worker.list': wrapInResponse(dwh.getWorkers),
            'worker.confirm': this.confirmWorker,
            'order.buy': this.buyOrder,
            'deal.close': this.closeDeal,
            'deal.createChangeRequest': this.createChangeRequest,
            'deal.cancelChangeRequest': this.cancelChangeRequest,
            'order.getParams': wrapInResponse(this.getOrderParams),
            'order.waitForDeal': wrapInResponse(this.waitForOrderDeal),
            'market.getValidators': wrapInResponse(dwh.getValidators),

            getKYCLink: this.getKYCLink,
            getSonmTokenAddress: this.getSonmTokenAddress,
            getTokenExchangeRate: this.getTokenExchangeRate,

            addToken: this.addToken,
            removeToken: this.removeToken,
            getTokenInfo: this.getTokenInfo,
            getPresetTokenList: this.getPresetTokenList,
        };
    }

    public decrypt = (data: string): any => {
        return data
            ? JSON.parse(AES.decrypt(data, this.secretKey).toString(Utf8))
            : null;
    };

    public encrypt = (data: any): string => {
        return AES.encrypt(
            data ? JSON.stringify(data) : null,
            this.secretKey,
        ).toString();
    };

    public getWalletList = async (): Promise<t.IResponse> => {
        return {
            data: (await this.getWallets()).data.map(
                (w: Wallet) => new Wallet(w),
            ),
        };
    };

    private getWallets = async () => {
        const walletList = await this.getDataFromStorage(
            KEY_WALLETS_LIST,
            false,
        );

        if (walletList) {
            return walletList;
        } else {
            return {
                version: STORAGE_VERSION,
                data: [],
            };
        }
    };

    public getSettings = async (): Promise<t.IResponse> => {
        return {
            data: this.storage.settings,
        };
    };

    public setSettings = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.settings) {
            this.storage.settings = data.settings;
            await this.saveData();

            return {
                data: true,
            };
        } else {
            throw new Error('required_params_missed');
        }
    };

    public checkConnection = async (): Promise<t.IResponse> => {
        try {
            await this.getGasPrice();

            return {
                data: true,
            };
        } catch (err) {
            return {
                data: false,
            };
        }
    };

    public getPrivateKey = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.address) {
            const { address, password } = data;

            return this.checkAccountPassword(password, address);
        } else {
            throw new Error('required_params_missed');
        }
    };

    private async checkAccountPassword(
        password: string,
        address: string,
        privateChain: boolean = false,
    ): Promise<t.IResponse> {
        if (!password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        }

        address = utils.add0x(address).toLowerCase();

        const client = await this.initAccount(address, privateChain);

        if (client && client.password) {
            if (client.password !== password) {
                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            } else {
                return {
                    data: client.privateKey,
                };
            }
        } else {
            const accounts = (await this.getAccounts()) || {};

            try {
                const privateKey = await utils.recoverPrivateKey(
                    accounts[address].json,
                    password,
                );
                client.factory.setPrivateKey(privateKey);
                client.password = password;
                client.privateKey = privateKey;

                return {
                    data: privateKey,
                };
            } catch (err) {
                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            }
        }
    }

    private createAccount = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.password) {
            return {
                data: JSON.stringify(utils.newAccount(data.password)),
            };
        } else {
            throw new Error('required_params_missed');
        }
    };

    private createAccountFromPrivateKey = async (
        data: t.IPayload,
    ): Promise<t.IResponse> => {
        if (data.password && data.privateKey) {
            try {
                return {
                    data: JSON.stringify(
                        utils.newAccount(data.password, data.privateKey),
                    ),
                };
            } catch (err) {
                return {
                    validation: {
                        privateKey: 'privatekey_not_valid',
                    },
                };
            }
        } else {
            throw new Error('required_params_missed');
        }
    };

    private setWalletHash(name: string) {
        this.hash = `sonm_${SHA256(name).toString(Hex)}`;
    }

    public createWallet = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.password && data.walletName && data.chainId) {
            this.setWalletHash(data.walletName);
            this.secretKey = data.password;

            data.chainId = data.chainId.toLowerCase();

            this.storage.version = STORAGE_VERSION;

            let chainId = data.chainId;
            let nodeUrl = DEFAULT_NODES[chainId];
            if (nodeUrl === undefined) {
                chainId = 'default';
                nodeUrl = DEFAULT_NODES.default;
            }
            this.storage.settings = {
                chainId,
                nodeUrl,
            };
            await this.saveData();

            // add wallet to list
            const walletList = await this.getWallets();
            const wallet = {
                name: data.walletName,
                chainId: this.storage.settings.chainId,
                nodeUrl: this.storage.settings.nodeUrl,
            };

            walletList.data.push(wallet);

            const tokenList = await this.getTokenList();
            this.storage.tokens = tokenList.getList();

            await this.saveDataToStorage(KEY_WALLETS_LIST, walletList, false);

            this.dwh.setNetworkURL(chainId);

            return {
                data: wallet,
            };
        } else {
            const validation = {
                password: !data.password ? 'password_required' : null,
                walletName: !data.walletName ? 'walletName_required' : null,
                chainId: !data.chainId ? 'chain_id_required' : null,
            };

            return {
                validation,
            };
        }
    };

    public importWallet = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.password && data.file && data.walletName) {
            if (data.file.substr(0, 4) === 'sonm') {
                try {
                    this.setWalletHash(data.walletName);
                    this.secretKey = data.password;

                    const storage = await this.checkStorageVersion(
                        'wallet',
                        this.decrypt(data.file.substr(4)),
                    );
                    this.storage = storage;
                    await this.saveData();

                    this.storage = await this.getDataFromStorage(
                        this.hash,
                        true,
                    );

                    // add wallet to list
                    const walletList = await this.getWallets();

                    const walletInfo = {
                        name: data.walletName,
                        chainId: this.storage.settings.chainId,
                        nodeUrl: this.storage.settings.nodeUrl,
                    };
                    walletList.data.push(walletInfo);

                    try {
                        const tokenList = await this.getTokenList();
                        for (const token of this.storage.tokens) {
                            await tokenList.add(token.address);
                        }
                    } catch (err) {}

                    await this.saveDataToStorage(
                        KEY_WALLETS_LIST,
                        walletList,
                        false,
                    );

                    return {
                        data: walletInfo,
                    };
                } catch (err) {
                    return {
                        validation: {
                            password: 'password_not_valid',
                        },
                    };
                }
            } else {
                return {
                    validation: {
                        encodedWallet: 'not_sonm_wallet_file',
                    },
                };
            }
        } else {
            const validation = {
                password: !data.password ? 'password_required' : null,
                encodedWallet: !data.file ? 'walletFile_required' : null,
                walletName: !data.walletName ? 'walletName_required' : null,
            };

            return {
                validation,
            };
        }
    };

    public unlockWallet = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.password && data.walletName) {
            this.setWalletHash(data.walletName);
            this.secretKey = data.password;

            const dataFromStorage = await this.getDataFromStorage(
                this.hash,
                true,
            );

            if (dataFromStorage) {
                this.storage = dataFromStorage;

                try {
                    const tokenList = await this.getTokenList();

                    if (!this.storage.tokens.length) {
                        this.storage.tokens = tokenList.getList();
                    } else {
                        for (const token of this.storage.tokens) {
                            await tokenList.add(token.address);
                        }
                    }
                } catch (err) {}

                await this.saveData();

                this.processTransactions();

                return {
                    data: true,
                };
            } else {
                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            }
        } else {
            const validation = {
                password: !data.password ? 'password_required' : null,
                walletName: !data.walletName ? 'walletName_required' : null,
            };

            return {
                validation,
            };
        }
    };

    public exportWallet = async (): Promise<t.IResponse> => {
        return {
            data: 'sonm' + this.encrypt(this.storage),
        };
    };

    public getAccountList = async (): Promise<t.IResponse> => {
        const accounts = (await this.getAccounts()) || {};
        const addresses = Object.keys(accounts);
        //lazy init tokens
        try {
            if (
                this.storage.tokens.length !== this.tokenList.getList().length
            ) {
                const tokenList = await this.getTokenList();

                for (const token of this.storage.tokens) {
                    await tokenList.add(token.address);
                }
            } else if (!this.storage.tokens.length) {
                const tokenList = await this.getTokenList();
                this.storage.tokens = tokenList.getList();

                await this.saveData();
            }
        } catch (err) {}

        const requests = [];
        const marketRequests = [];
        const tokenList = await this.getTokenList(true);

        for (const address of Object.keys(accounts)) {
            requests.push(this.getCurrencyBalances(address));
            marketRequests.push(tokenList.getBalances(address));
        }

        let balancies, rateResponse, marketBalancies;
        try {
            [rateResponse, balancies, marketBalancies] = await Promise.all([
                this.getTokenExchangeRate(),
                Promise.all(requests),
                Promise.all(marketRequests),
            ]);
        } catch (err) {
            //console.log(err);
        }

        const rate =
            rateResponse && rateResponse.data ? rateResponse.data : undefined;

        const list = [] as IAccountInfo[];
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];

            if (accounts[address]) {
                const item = {
                    address,
                    marketBalance: '0',
                    marketUsdBalance: '0',
                    name: accounts[address].name,
                    json: JSON.stringify(accounts[address].json),
                    currencyBalanceMap:
                        balancies && balancies[i] ? balancies[i] : {},
                };

                if (marketBalancies && marketBalancies[i]) {
                    const marketBalance = marketBalancies[i];

                    item.marketBalance =
                        marketBalance[Object.keys(marketBalance)[1]];
                    item.marketUsdBalance =
                        parseInt(rate, 10) > 0
                            ? new BN(item.marketBalance + WEI_PRECISION)
                                  .div(new BN(rate))
                                  .toString()
                            : '0';
                }

                list.push(item);
            }
        }

        return {
            data: list,
        };
    };

    private saveData = async () => {
        await this.saveDataToStorage(this.hash, this.storage, true);
    };

    private saveDataToStorage = async (
        key: string,
        data: any,
        encrypt: boolean,
    ): Promise<void> => {
        await ipcSend('set', {
            key,
            value: encrypt ? this.encrypt(data) : JSON.stringify(data),
        });
    };

    private getDataFromStorage = async (
        key: string,
        decrypt: boolean,
    ): Promise<any> => {
        const dataFromStorage = await ipcSend('get', { key });

        if (dataFromStorage) {
            try {
                const data = decrypt
                    ? this.decrypt(dataFromStorage)
                    : JSON.parse(dataFromStorage);

                const storage = await this.checkStorageVersion(key, data);

                if (key !== KEY_WALLETS_LIST) {
                    this.dwh.setNetworkURL(storage.settings.chainId);

                    for (const token of storage.tokens) {
                        token.address = token.address.toLowerCase();
                    }
                }
                return storage;
            } catch (err) {
                // console.log(err);
                return false;
            }
        } else {
            return false;
        }
    };

    private checkStorageVersion = async (key: string, data: any) => {
        if (!data.version || data.version !== STORAGE_VERSION) {
            try {
                data = migrate(
                    key === KEY_WALLETS_LIST ? 'wallet_list' : 'wallet',
                    data,
                );

                if (key === KEY_WALLETS_LIST) {
                    await this.saveDataToStorage(KEY_WALLETS_LIST, data, false);
                } else {
                    await this.saveData();
                }
            } catch (err) {
                console.log(err.stack);
            }
        }

        return data;
    };

    private getAccounts = async (): Promise<t.IAccounts | null> => {
        return this.storage.accounts || null;
    };

    public async ping(): Promise<t.IResponse> {
        return {
            data: {
                pong: true,
            },
        };
    }

    private async processTransactions() {
        const factory = createSonmFactory(
            this.storage.settings.nodeUrl,
            this.storage.settings.chainId,
        );
        const transactions = [];

        let needSave = false;
        for (const transaction of this.storage.transactions) {
            // remove pending
            if (transaction.hash !== PENDING_HASH) {
                if (transaction.status === 'pending') {
                    const checkTransaction = await factory.gethClient.getTransaction(
                        transaction.hash,
                    );
                    if (checkTransaction) {
                        transactions.push(transaction);

                        const txResult = factory.createTxResult(
                            transaction.hash,
                        );
                        this.proceedTx(transaction, txResult);
                    }
                } else {
                    transactions.push(transaction);
                }

                needSave = true;
            }
        }

        this.storage.transactions = transactions;

        if (needSave) {
            this.saveData();
        }
    }

    public getCurrencyBalances = async (address: string): Promise<any> => {
        if (address) {
            const tokenList = await this.getTokenList();
            const balancies = await tokenList.getBalances(address);

            return balancies;
        } else {
            throw new Error('required_params_missed');
        }
    };

    public addToken = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.address) {
            try {
                const tokenList = await this.getTokenList();
                const token = await tokenList.add(data.address);

                this.storage.tokens = tokenList.getList();
                await this.saveData();

                return {
                    data: token,
                };
            } catch (err) {
                return {
                    validation: {
                        address: err.message,
                    },
                };
            }
        } else {
            throw new Error('required_params_missed');
        }
    };

    public removeToken = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.address) {
            const tokenList = await this.getTokenList();
            await tokenList.remove(data.address);

            this.storage.tokens = tokenList.getList();
            await this.saveData();

            return {
                data: true,
            };
        } else {
            throw new Error('required_params_missed');
        }
    };

    public getTokenInfo = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.address) {
            try {
                const tokenList = await this.getTokenList();
                const token = await tokenList.getTokenInfo(
                    data.address,
                    data.accounts,
                );

                return {
                    data: token,
                };
            } catch (err) {
                return {
                    validation: {
                        address: err.message,
                    },
                };
            }
        } else {
            throw new Error('required_params_missed');
        }
    };

    private getFactory(privateChain = false) {
        const chainId = this.storage.settings.chainId;
        const nodeUrl =
            DEFAULT_NODES[chainId + (privateChain ? '_private' : '')];

        return createSonmFactory(nodeUrl, chainId, privateChain);
    }

    private async getTokenList(privateChain = false) {
        const key = privateChain ? 'main' : 'private';

        if (!this.tokenList[key]) {
            const factory = this.getFactory(privateChain);
            this.tokenList[key] = await factory.createTokenList();
        }

        return this.tokenList[key];
    }

    private async initAccount(address: string, privateChain = false) {
        const key = privateChain ? 'main' : 'private';
        address = address.toLowerCase();

        if (!this.accounts[key]) {
            this.accounts[key] = {};
        }

        if (!this.accounts[key][address]) {
            const factory = this.getFactory(privateChain);

            this.accounts[key][address] = {
                factory,
                account: await factory.createAccount(address),
                password: null,
            };
        }

        return this.accounts[key][address];
    }

    public getMarketBalance = async (
        data: t.IPayload,
    ): Promise<t.IResponse> => {
        if (data.address) {
            const tokenList = await this.getTokenList(true);
            const balancies = await tokenList.getBalances(data.address);

            return {
                data: balancies[Object.keys(balancies)[1]],
            };
        } else {
            throw new Error('required_params_missed');
        }
    };

    public getCurrencies = async (data: t.IPayload): Promise<t.IResponse> => {
        return {
            data: this.storage.tokens,
        };
    };

    public getGasPrice = async (): Promise<t.IResponse> => {
        const factory = createSonmFactory(
            this.storage.settings.nodeUrl,
            this.storage.settings.chainId,
        );
        const gasPrice = (await factory.gethClient.getGasPrice()).toString();

        return {
            data: gasPrice,
        };
    };

    public getTokenExchangeRate = async (): Promise<t.IResponse> => {
        const client = await this.initAccount(ZERO_ADDRESS, true);

        return {
            data: await client.account.getTokenExchangeRate(),
        };
    };

    public buyOrder = async (data: t.IPayload): Promise<t.IResponse> => {
        if (!data.password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        } else if (data.address && data.id && data.password) {
            return this.getMethod('buyOrder', [data.id], true)(data);
        } else {
            throw new Error('required_params_missed');
        }
    };

    public confirmWorker = async (data: t.IPayload): Promise<t.IResponse> => {
        if (!data.password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        } else if (data.address && data.slaveId && data.password) {
            return this.getMethod('confirmWorker', [data.slaveId], true)(data);
        } else {
            throw new Error('required_params_missed');
        }
    };

    public getKYCLink = async (data: t.IPayload): Promise<t.IResponse> => {
        if (!data.password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        } else if (
            data.address &&
            data.kycAddress &&
            data.password &&
            data.fee
        ) {
            return this.getMethod(
                'getKYCLink',
                [data.fee, data.kycAddress],
                true,
            )(data);
        } else {
            throw new Error('required_params_missed');
        }
    };

    public closeDeal = async (data: t.IPayload): Promise<t.IResponse> => {
        if (!data.password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        } else if (data.address && data.id && data.password) {
            return this.getMethod(
                'closeDeal',
                [data.id, data.isBlacklisted || false],
                true,
            )(data);
        } else {
            throw new Error('required_params_missed');
        }
    };

    public createChangeRequest = async (
        data: t.IPayload,
    ): Promise<t.IResponse> => {
        if (!data.password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        } else if (data.address && data.id && data.password) {
            data.newPrice = data.newPrice
                ? DWH.recalculatePriceOut(data.newPrice)
                : '0';

            return this.getMethod(
                'createChangeRequest',
                [data.id, data.newPrice, data.newDuration || 0],
                true,
            )(data);
        } else {
            throw new Error('required_params_missed');
        }
    };

    public cancelChangeRequest = async (
        data: t.IPayload,
    ): Promise<t.IResponse> => {
        if (!data.password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        } else if (data.address && data.id && data.password) {
            return this.getMethod('cancelChangeRequest', [data.id], true)(data);
        } else {
            throw new Error('required_params_missed');
        }
    };

    public getOrderParams = async ({
        address,
        id,
    }: any): Promise<t.IOrderParams> => {
        tcomb.String(address);
        tcomb.String(id);

        const client = await this.initAccount(address, true);
        return client.account.getOrderParams(id);
    };

    public waitForOrderDeal = async ({
        address,
        id,
        retryDelay = 1000,
        retries = 30,
    }: any): Promise<t.IOrderParams> => {
        tcomb.String(address);
        tcomb.String(id);
        tcomb.Number(retryDelay);
        tcomb.Number(retries);

        const client = await this.initAccount(address, true);
        let orderParams;

        while (retries >= 0) {
            orderParams = await client.account.getOrderParams(id);

            if (orderParams && orderParams.dealID !== '0') {
                return orderParams;
            }

            await delay(retryDelay);
            retries--;
        }

        return orderParams;
    };

    public getSonmTokenAddress = async (): Promise<t.IResponse> => {
        const factory = createSonmFactory(
            this.storage.settings.nodeUrl,
            this.storage.settings.chainId,
        );

        return {
            data: await factory.getSonmTokenAddress(),
        };
    };

    public addAccount = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.json && data.password && data.name) {
            try {
                const json = JSON.parse(data.json.toLowerCase());

                const accounts = (await this.getAccounts()) || {};
                const address = utils.add0x(json.address);

                if (!accounts[address]) {
                    const privateKey = await utils.recoverPrivateKey(
                        json,
                        data.password,
                    );

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
                            currencyBalanceMap: await this.getCurrencyBalances(
                                address,
                            ),
                        },
                    };
                } else {
                    return {
                        validation: {
                            json: 'account_already_exists',
                        },
                    };
                }
            } catch (err) {
                console.log(err);

                return {
                    validation: {
                        password: 'password_not_valid',
                    },
                };
            }
        } else {
            throw new Error('required_params_missed');
        }
    };

    public renameAccount = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.address && data.name) {
            const accounts = (await this.getAccounts()) || {};
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
    };

    public removeAccount = async (data: t.IPayload): Promise<t.IResponse> => {
        if (data.address) {
            const address = data.address;
            const accounts = (await this.getAccounts()) || {};

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
    };

    public requestTestTokens = async (
        data: t.IPayload,
    ): Promise<t.IResponse> => {
        if (data.address && data.password) {
            const validation = await this.checkAccountPassword(
                data.password,
                data.address,
            );

            if (!validation.data) {
                return validation;
            }

            const client = await this.initAccount(data.address);

            return {
                data: await client.account.requestTestTokens(),
            };
        } else {
            throw new Error('required_params_missed');
        }
    };

    public getTransactions = async () => {
        const data = await ipcSend('get', { key: 'transactions' });

        if (data) {
            return this.decrypt(data) || [];
        } else {
            return [];
        }
    };

    public getPresetTokenList = async (
        data: t.IPayload,
    ): Promise<t.IResponse> => {
        return {
            data: DEFAULT_TOKENS[this.storage.settings.chainId],
        };
    };

    public transaction = (action: string) => {
        return async (data: t.IPayload): Promise<t.IResponse> => {
            const {
                fromAddress,
                toAddress,
                currencyAddress,
                password,
                gasLimit,
                timestamp,
                amount,
                gasPrice,
            } = data;

            const privateChain = action === 'withdraw' ? true : false;
            const validation = await this.checkAccountPassword(
                password,
                fromAddress,
                privateChain,
            );

            if (!validation.data) {
                return validation;
            }

            const transactions = this.storage.transactions;
            const token = this.storage.tokens.find(
                (item: ICurrencyInfo) => item.address === currencyAddress,
            );

            const transaction = {
                action,
                timestamp,
                fromAddress,
                toAddress,
                amount,
                currencyAddress,
                currencySymbol: token.symbol,
                decimalPointOffset: token.decimals,
                hash: PENDING_HASH,
                fee: null,
                status: 'pending',
            };

            transactions.unshift(transaction);

            const client = await this.initAccount(fromAddress, privateChain);

            try {
                let txResult;
                if (action === 'wallet') {
                    txResult =
                        currencyAddress === '0x'
                            ? await client.account.sendEther(
                                  toAddress,
                                  amount,
                                  gasLimit,
                                  gasPrice,
                              )
                            : await client.account.sendTokens(
                                  toAddress,
                                  amount,
                                  currencyAddress,
                                  gasLimit,
                                  gasPrice,
                              );
                } else {
                    txResult = await client.account.migrateToken(
                        amount,
                        gasLimit,
                        gasPrice,
                    );
                }

                if (txResult) {
                    transaction.hash = await txResult.getHash();

                    await this.saveData();
                    await this.proceedTx(transaction, txResult);
                } else {
                    transaction.status = 'failed';
                    transaction.hash = '';
                }

                return {
                    data: transaction,
                };
            } catch (err) {
                console.log(err);

                transactions.shift();
                throw err;
            }
        };
    };

    public getMethod = (
        method: string,
        params: any,
        privateChain: boolean = false,
    ) => {
        return async (data: t.IPayload): Promise<t.IResponse> => {
            if (data.address && data.password) {
                const validation = await this.checkAccountPassword(
                    data.password,
                    data.address,
                    privateChain,
                );

                if (!validation.data) {
                    return validation;
                }

                const client = await this.initAccount(
                    data.address,
                    privateChain,
                );

                return {
                    data: await client.account[method](...params),
                };
            } else {
                throw new Error('required_params_missed');
            }
        };
    };

    private async proceedTx(transaction: any, txResult: any) {
        const receipt = await txResult.getReceipt();
        const fee = await txResult.getTxPrice();

        transaction.status = receipt.status === '0x0' ? 'failed' : 'success';
        transaction.fee = fee.toString();

        await this.saveData();
    }

    public getTransactionList = async (
        data: t.IPayload,
    ): Promise<t.IListResult<t.ISendTransactionResult>> => {
        let { filter, limit, offset } = data;
        filter = filter ? JSON.parse(filter) : {};

        limit = limit || 10;
        offset = offset || 0;
        filter.source = filter.source || 'wallet';

        let filtered = [];
        for (const item of this.storage.transactions) {
            const sidechainAction = item.fromAddress === item.toAddress;

            let ok = true;

            // filter transaction by source
            if (filter.source === 'wallet' && sidechainAction) {
                ok = false;
            } else if (filter.source === 'market' && !sidechainAction) {
                ok = false;
            }

            if (Object.keys(filter).length) {
                for (const type of ['fromAddress', 'currencyAddress']) {
                    if (filter[type] && item[type] !== filter[type]) {
                        ok = false;
                    }
                }

                if (
                    filter.query &&
                    !item.toAddress.includes(filter.query) &&
                    !item.hash.includes(filter.query)
                ) {
                    ok = false;
                }

                if (filter.timeStart && item.timestamp < filter.timeStart) {
                    ok = false;
                }

                if (filter.timeEnd && item.timestamp > filter.timeEnd) {
                    ok = false;
                }

                if (filter.operation && item.action !== filter.operation) {
                    ok = false;
                }
            }

            if (ok === true) {
                filtered.push(item);
            }
        }

        const total = filtered.length;
        filtered = filtered.slice(offset, offset + limit);

        return {
            records: filtered,
            total,
        };
    };

    public async resolve(type: string, payload: any): Promise<t.IResponse> {
        if (this.routes[type]) {
            return this.routes[type](payload);
        } else {
            throw new Error('route_not_exists');
        }
    }
}

export const api = new Api(new DWH());
