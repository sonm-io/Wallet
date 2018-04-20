import ipc from './ipc';
import { TResultPromise } from '../../ipc/types';
import {
    ISendTransactionResult,
    IAccountInfo,
    ICurrencyInfo,
    ISendTransaction,
    IResult,
    ITxListFilter,
    ISettings,
    IWalletListItem,
} from './types';

export * from './types';

async function ipcSend(type: string, payload?: any): TResultPromise<any> {
    return ipc.send(type, payload);
}

export class Api {
    public static async createWallet(
        password: string,
        walletName: string,
        chainId: string,
    ): Promise<IResult<IWalletListItem>> {
        return ipcSend('createWallet', { password, walletName, chainId });
    }

    public static async unlockWallet(
        password: string,
        walletName: string,
    ): Promise<IResult<boolean>> {
        return ipcSend('unlockWallet', { password, walletName });
    }

    public static async importWallet(
        password: string,
        walletName: string,
        file: string,
    ): Promise<IResult<IWalletListItem>> {
        return ipcSend('importWallet', { password, walletName, file });
    }

    public static async exportWallet(): Promise<IResult<string>> {
        return ipcSend('exportWallet');
    }

    public static async checkConnection(): Promise<IResult<boolean>> {
        return ipcSend('checkConnection');
    }

    public static async getPrivateKey(
        password: string,
        address: string,
    ): Promise<IResult<string>> {
        return ipcSend('account.getPrivateKey', { address, password });
    }

    public static async createAccount(
        password: string,
        privateKey?: string,
    ): Promise<IResult<string>> {
        if (privateKey) {
            return ipcSend('account.createFromPrivateKey', {
                privateKey,
                password,
            });
        } else {
            return ipcSend('account.create', { password });
        }
    }

    public static async getWalletList(): Promise<IResult<IWalletListItem[]>> {
        return ipcSend('getWalletList');
    }

    public static async getSettings(): Promise<IResult<string[]>> {
        return ipcSend('getSettings');
    }

    public static async setSettings(
        settings: ISettings,
    ): Promise<IResult<string[]>> {
        return ipcSend('setSettings', { settings });
    }

    public static async addAccount(
        jsonRaw: string,
        password: string,
        name: string,
    ): Promise<IResult<IAccountInfo>> {
        return ipcSend('account.add', { json: jsonRaw, password, name });
    }

    public static async removeAccount(
        address: string,
    ): Promise<IResult<boolean>> {
        return ipcSend('account.remove', { address });
    }

    public static async requestTestTokens(
        password: string,
        address: string,
    ): Promise<IResult<boolean>> {
        return ipcSend('account.requestTestTokens', {
            address,
            password,
        });
    }

    public static async renameAccount(
        address: string,
        name: string,
    ): Promise<IResult<boolean>> {
        return ipcSend('account.rename', { address, name });
    }

    public static async getAccountList(): Promise<IResult<IAccountInfo[]>> {
        return ipcSend('account.list');
    }

    public static async ping(): Promise<IResult<object>> {
        return ipcSend('ping', { ping: true });
    }

    public static async getCurrencyList(): Promise<IResult<ICurrencyInfo[]>> {
        return ipcSend('account.getCurrencies');
    }

    public static async send(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        return ipcSend('account.send', { ...tx, password });
    }

    public static async deposit(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        return ipcSend('account.deposit', { ...tx, password });
    }

    public static async withdraw(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        return ipcSend('account.withdraw', { ...tx, password });
    }

    public static async getSendTransactionList(
        source?: string,
        filters?: ITxListFilter,
        limit?: number,
        offset?: number,
    ): Promise<IResult<[ISendTransactionResult[], number]>> {
        return ipcSend('transaction.list', { filters, limit, offset, source });
    }

    public static async getGasPrice(): Promise<IResult<string>> {
        return ipcSend('account.getGasPrice');
    }

    public static async getSonmTokenAddress(): Promise<IResult<string>> {
        return ipcSend('getSonmTokenAddress');
    }

    public static async addToken(
        address: string,
    ): Promise<IResult<ICurrencyInfo>> {
        return ipcSend('addToken', { address });
    }

    public static async removeToken(
        address: string,
    ): Promise<IResult<boolean>> {
        return ipcSend('removeToken', { address });
    }

    public static async getTokenInfo(
        address: string,
        accounts?: string[],
    ): Promise<IResult<ICurrencyInfo>> {
        return ipcSend('getTokenInfo', { address, accounts });
    }

    public static async getPresetTokenList(): Promise<
        IResult<ICurrencyInfo[]>
    > {
        return ipcSend('getPresetTokenList');
    }
}

export default Api;
