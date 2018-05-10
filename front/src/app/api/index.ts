import { ipc as IPC } from './ipc';
import { ProfileApi } from './sub/profile-api';
import { OrderApi } from './sub/order-api';
import {
    ISendTransactionResult,
    IAccountInfo,
    ICurrencyInfo,
    ISendTransaction,
    IResult,
    ITxListFilter,
    ISettings,
    IWalletListItem,
    ISender,
} from './types';

export * from './types';

class AllApi {
    private ipc: ISender = IPC;

    public profile = new ProfileApi(this.ipc);
    public order = new OrderApi(this.ipc);

    public async createWallet(
        password: string,
        walletName: string,
        chainId: string,
    ): Promise<IResult<IWalletListItem>> {
        return this.ipc.send('createWallet', { password, walletName, chainId });
    }

    public async unlockWallet(
        password: string,
        walletName: string,
    ): Promise<IResult<boolean>> {
        return this.ipc.send('unlockWallet', { password, walletName });
    }

    public async importWallet(
        password: string,
        walletName: string,
        file: string,
    ): Promise<IResult<IWalletListItem>> {
        return this.ipc.send('importWallet', { password, walletName, file });
    }

    public async exportWallet(): Promise<IResult<string>> {
        return this.ipc.send('exportWallet');
    }

    public async checkConnection(): Promise<IResult<boolean>> {
        return this.ipc.send('checkConnection');
    }

    public async getPrivateKey(
        password: string,
        address: string,
    ): Promise<IResult<string>> {
        return this.ipc.send('account.getPrivateKey', { address, password });
    }

    public async createAccount(
        password: string,
        privateKey?: string,
    ): Promise<IResult<string>> {
        if (privateKey) {
            return this.ipc.send('account.createFromPrivateKey', {
                privateKey,
                password,
            });
        } else {
            return this.ipc.send('account.create', { password });
        }
    }

    public async getWalletList(): Promise<IResult<IWalletListItem[]>> {
        return this.ipc.send('getWalletList');
    }

    public async getSettings(): Promise<IResult<string[]>> {
        return this.ipc.send('getSettings');
    }

    public async setSettings(settings: ISettings): Promise<IResult<string[]>> {
        return this.ipc.send('setSettings', { settings });
    }

    public async addAccount(
        jsonRaw: string,
        password: string,
        name: string,
    ): Promise<IResult<IAccountInfo>> {
        return this.ipc.send('account.add', { json: jsonRaw, password, name });
    }

    public async removeAccount(address: string): Promise<IResult<boolean>> {
        return this.ipc.send('account.remove', { address });
    }

    public async requestTestTokens(
        password: string,
        address: string,
    ): Promise<IResult<boolean>> {
        return this.ipc.send('account.requestTestTokens', {
            address,
            password,
        });
    }

    public async buyOrder(
        password: string,
        address: string,
        id: number,
    ): Promise<IResult<boolean>> {
        return this.ipc.send('market.buyOrder', {
            password,
            address,
            id,
        });
    }

    public async renameAccount(
        address: string,
        name: string,
    ): Promise<IResult<boolean>> {
        return this.ipc.send('account.rename', { address, name });
    }

    public async getAccountList(): Promise<IResult<IAccountInfo[]>> {
        return this.ipc.send('account.list');
    }

    public async ping(): Promise<IResult<object>> {
        return this.ipc.send('ping', { ping: true });
    }

    public async getCurrencyList(): Promise<IResult<ICurrencyInfo[]>> {
        return this.ipc.send('account.getCurrencies');
    }

    public async getMarketBalance(address: string): Promise<IResult<string>> {
        return this.ipc.send('account.getMarketBalance', { address });
    }

    public async getTokenExchangeRate(): Promise<IResult<string>> {
        return this.ipc.send('getTokenExchangeRate');
    }

    public async send(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        return this.ipc.send('account.send', { ...tx, password });
    }

    public async deposit(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        return this.ipc.send('account.deposit', { ...tx, password });
    }

    public async withdraw(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        return this.ipc.send('account.withdraw', { ...tx, password });
    }

    public async getSendTransactionList(
        source?: string,
        filters?: ITxListFilter,
        limit?: number,
        offset?: number,
    ): Promise<IResult<[ISendTransactionResult[], number]>> {
        return this.ipc.send('transaction.list', {
            filters,
            limit,
            offset,
            source,
        });
    }

    public async getGasPrice(): Promise<IResult<string>> {
        return this.ipc.send('account.getGasPrice');
    }

    public async getSonmTokenAddress(): Promise<IResult<string>> {
        return this.ipc.send('getSonmTokenAddress');
    }

    public async addToken(address: string): Promise<IResult<ICurrencyInfo>> {
        return this.ipc.send('addToken', { address });
    }

    public async removeToken(address: string): Promise<IResult<boolean>> {
        return this.ipc.send('removeToken', { address });
    }

    public async getTokenInfo(
        address: string,
        accounts?: string[],
    ): Promise<IResult<ICurrencyInfo>> {
        return this.ipc.send('getTokenInfo', { address, accounts });
    }

    public async getPresetTokenList(): Promise<IResult<ICurrencyInfo[]>> {
        return this.ipc.send('getPresetTokenList');
    }
}

export const Api = new AllApi();

export default Api;
