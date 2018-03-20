import { Request } from '../ipc/messages';
import * as sonmApi from 'sonm-api';
import * as AES from 'crypto-js/aes';
import * as SHA256 from 'crypto-js/sha256';
import * as Utf8 from 'crypto-js/enc-utf8';
import * as Hex from 'crypto-js/enc-hex';
import * as ipc from '../ipc/ipc';
import * as t from 'app/api/types';

import { migrate } from '../migrations';

const { createSonmFactory, utils } = sonmApi;

const STORAGE_VERSION = 2;
const KEY_WALLETS_LIST = 'sonm_wallets';
const PENDING_HASH = 'waiting for hash...';

interface INodes {
    [index: string]: string;
}

interface ITokens {
    [index: string]: t.ICurrencyInfo[];
}

interface IPayload {
    [index: string]: any;
}

interface IWalletJson {
    address: string;
    crypto: object;
}

interface IAccounts {
    [address: string]: {
        json: IWalletJson;
        name: string;
        address: string;
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

function createPromise(action: string, payload?: any): Promise<any> {
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

const DEFAULT_NODES: INodes = {
    default: 'https://mainnet.infura.io',
    livenet: 'https://mainnet.infura.io',
    rinkeby: 'https://rinkeby.infura.io',
    testrpc: 'http://localhost:8545',
};

const DEFAULT_TOKENS: ITokens = {
    livenet: [
        {
            name: 'STORJ',
            decimalPointOffset: 18,
            symbol: 'STORJ',
            address: '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
        },
    ],
    rinkeby: [
        {
            name: 'PIG',
            decimalPointOffset: 18,
            symbol: 'PIG',
            address: '0x917cc8f2180e469c733abc67e1b36b0ab3aeff60',
        },
    ],
    testrpc: [
        {
            name: 'PIG',
            decimalPointOffset: 18,
            symbol: 'PIG',
            address: '0x917cc8f2180e469c733abc67e1b36b0ab3aeff60',
        },
    ],
};

class Api {
    private routes: {
        [index: string]: any;
    };

    private accounts: {
        [index: string]: any;
    };

    private storage: {
        [index: string]: any;
    };

    private secretKey: string = '';
    private hash: string = '';
    private tokenList: any;

    private constructor() {
        this.accounts = {};

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
            'account.send': this.send,
            'account.list': this.getAccountList,
            'account.requestTestTokens': this.requestTestTokens,
            'account.getPrivateKey': this.getPrivateKey,

            'transaction.list': this.getTransactionList,

            getSonmTokenAddress: this.getSonmTokenAddress,

            addToken: this.addToken,
            removeToken: this.removeToken,
            getTokenInfo: this.getTokenInfo,
            getPresetTokenList: this.getPresetTokenList,
        };

        this.storage = {
            accounts: {},
            transactions: [],
            tokens: [],
            settings: {
                chainId: null,
                nodeUrl: null,
            },
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

    public getWalletList = async (): Promise<IResponse> => {
        return {
            data: (await this.getWallets()).data,
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

    public getSettings = async (): Promise<IResponse> => {
        return {
            data: this.storage.settings,
        };
    };

    public setSettings = async (data: IPayload): Promise<IResponse> => {
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

    public checkConnection = async (): Promise<IResponse> => {
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

    public getPrivateKey = async (data: IPayload): Promise<IResponse> => {
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
    ): Promise<IResponse> {
        if (!password) {
            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        }

        address = utils.add0x(address);

        const client = await this.initAccount(address);

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

    private createAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.passphase) {
            return {
                data: JSON.stringify(utils.newAccount(data.passphase)),
            };
        } else {
            throw new Error('required_params_missed');
        }
    };

    private createAccountFromPrivateKey = async (
        data: IPayload,
    ): Promise<IResponse> => {
        if (data.passphase && data.privateKey) {
            try {
                return {
                    data: JSON.stringify(
                        utils.newAccount(data.passphase, data.privateKey),
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

    public createWallet = async (data: IPayload): Promise<IResponse> => {
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

    public importWallet = async (data: IPayload): Promise<IResponse> => {
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

    public unlockWallet = async (data: IPayload): Promise<IResponse> => {
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

    public exportWallet = async (): Promise<IResponse> => {
        return {
            data: 'sonm' + this.encrypt(this.storage),
        };
    };

    public getAccountList = async (): Promise<IResponse> => {
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
        for (const address of Object.keys(accounts)) {
            requests.push(this.getCurrencyBalances(address));
        }

        let balancies;
        try {
            balancies = await Promise.all(requests);
        } catch (err) {
            //console.log(err);
        }

        const list = [] as t.IAccountInfo[];
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];

            if (accounts[address]) {
                list.push({
                    address,
                    name: accounts[address].name,
                    json: JSON.stringify(accounts[address].json),
                    currencyBalanceMap:
                        balancies && balancies[i] ? balancies[i] : {},
                });
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
        await createPromise('set', {
            key,
            value: encrypt ? this.encrypt(data) : JSON.stringify(data),
        });
    };

    private getDataFromStorage = async (
        key: string,
        decrypt: boolean,
    ): Promise<any> => {
        const dataFromStorage = await createPromise('get', { key });

        if (dataFromStorage) {
            try {
                const data = decrypt
                    ? this.decrypt(dataFromStorage)
                    : JSON.parse(dataFromStorage);

                return await this.checkStorageVersion(key, data);
            } catch (err) {
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

    private getAccounts = async (): Promise<IAccounts | null> => {
        return this.storage.accounts || null;
    };

    public async ping(): Promise<IResponse> {
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

    private async initAccount(address: string) {
        if (!this.accounts[address]) {
            const factory = createSonmFactory(
                this.storage.settings.nodeUrl,
                this.storage.settings.chainId,
            );

            this.accounts[address] = {
                factory,
                account: await factory.createAccount(address),
                password: null,
            };
        }

        return this.accounts[address];
    }

    public getCurrencyBalances = async (address: string): Promise<any> => {
        if (address) {
            const tokenList = await this.getTokenList();
            const balancies = await tokenList.getBalances(address);

            for (const key of Object.keys(balancies)) {
                balancies[key] = balancies[key];
            }

            return balancies;
        } else {
            throw new Error('required_params_missed');
        }
    };

    public addToken = async (data: IPayload): Promise<IResponse> => {
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

    public removeToken = async (data: IPayload): Promise<IResponse> => {
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

    public getTokenInfo = async (data: IPayload): Promise<IResponse> => {
        if (data.address) {
            try {
                const tokenList = await this.getTokenList();

                return {
                    data: await tokenList.getTokenInfo(data.address),
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

    private async getTokenList() {
        if (!this.tokenList) {
            const factory = createSonmFactory(
                this.storage.settings.nodeUrl,
                this.storage.settings.chainId,
            );
            this.tokenList = await factory.createTokenList();
        }

        return this.tokenList;
    }

    public getCurrencies = async (data: IPayload): Promise<IResponse> => {
        return {
            data: this.storage.tokens,
        };
    };

    public getGasPrice = async (): Promise<IResponse> => {
        const factory = createSonmFactory(
            this.storage.settings.nodeUrl,
            this.storage.settings.chainId,
        );
        const gasPrice = (await factory.gethClient.getGasPrice()).toString();

        return {
            data: gasPrice,
        };
    };

    public getSonmTokenAddress = async (): Promise<IResponse> => {
        const factory = createSonmFactory(
            this.storage.settings.nodeUrl,
            this.storage.settings.chainId,
        );

        return {
            data: await factory.getSonmTokenAddress(),
        };
    };

    public addAccount = async (data: IPayload): Promise<IResponse> => {
        if (data.json && data.password) {
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
                            password: 'account_already_exists',
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

    public renameAccount = async (data: IPayload): Promise<IResponse> => {
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

    public removeAccount = async (data: IPayload): Promise<IResponse> => {
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

    public requestTestTokens = async (data: IPayload): Promise<IResponse> => {
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
        const data = await createPromise('get', { key: 'transactions' });

        if (data) {
            return this.decrypt(data) || [];
        } else {
            return [];
        }
    };

    public getPresetTokenList = async (data: IPayload): Promise<IResponse> => {
        return {
            data: DEFAULT_TOKENS[this.storage.settings.chainId],
        };
    };

    public send = async (data: IPayload): Promise<IResponse> => {
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

        const validation = await this.checkAccountPassword(
            password,
            fromAddress,
        );

        if (!validation.data) {
            return validation;
        }

        const client = await this.initAccount(fromAddress);
        const transactions = this.storage.transactions;
        const token = this.storage.tokens.find(
            (item: t.ICurrencyInfo) => item.address === currencyAddress,
        );

        const transaction = {
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

        try {
            const txResult =
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

            transaction.hash = await txResult.getHash();

            await this.saveData();
            await this.proceedTx(transaction, txResult);

            return {
                data: transaction,
            };
        } catch (err) {
            transactions.shift();
            throw err;
        }
    };

    private async proceedTx(transaction: any, txResult: any) {
        const receipt = await txResult.getReceipt();
        const fee = await txResult.getTxPrice();

        transaction.status = receipt.status === '0x0' ? 'failed' : 'success';
        transaction.fee = fee.toString();

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
                for (const type of ['fromAddress', 'currencyAddress']) {
                    if (filters[type] && item[type] !== filters[type]) {
                        ok = false;
                    }
                }

                if (
                    filters.query &&
                    !item.toAddress.includes(filters.query) &&
                    !item.hash.includes(filters.query)
                ) {
                    ok = false;
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

        const total = filtered.length;
        filtered = filtered.slice(offset, offset + limit);

        return {
            data: [filtered, total],
        };
    };

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
