import { ipc as IPC } from './ipc';
import { ProfileApi } from './sub/profile-api';
import { OrderApi } from './sub/order-api';
import { DealApi } from './sub/deal-api';
import { WorkerApi } from './sub/worker-api';
import { HistoryApi } from './sub/history-api';
import {
    ISendTransactionResult,
    IAccountInfo,
    ICurrencyInfo,
    ISendTransaction,
    IResult,
    ISettings,
    IWalletListItem,
    ISender,
    IKycValidator,
    IWorker,
    IConnectionInfo,
} from './types';
import { TypeAccountInfoList } from './runtime-types';

export * from './types';

class AllApi {
    private ipc: ISender = IPC;

    public profile = new ProfileApi(this.ipc);
    public order = new OrderApi(this.ipc);
    public deal = new DealApi(this.ipc);
    public history = new HistoryApi(this.ipc);
    public worker = new WorkerApi(this.ipc);

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

    public async getConnectionInfo(): Promise<IResult<IConnectionInfo>> {
        return this.ipc.send('getConnectionInfo');
    }

    public async exportWallet(): Promise<IResult<string>> {
        return this.ipc.send('exportWallet');
    }

    public async checkConnection(): Promise<IResult<boolean>> {
        return this.ipc.send('checkConnection');
    }

    public getPrivateKey = async (
        password: string,
        address: string,
    ): Promise<IResult<string>> => {
        return this.ipc.send('account.getPrivateKey', { address, password });
    };

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
        return this.ipc.send('order.buy', {
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

    public async getAccountList(): Promise<IAccountInfo[]> {
        const data = await this.ipc.send('account.list');

        return TypeAccountInfoList(data.data);
    }

    public async ping(): Promise<IResult<object>> {
        return this.ipc.send('ping', { ping: true });
    }

    public async getCurrencyList(): Promise<IResult<ICurrencyInfo[]>> {
        return this.ipc.send('account.getCurrencies');
    }

    public getMarketBalance = async (
        address: string,
    ): Promise<IResult<string>> => {
        return this.ipc.send('account.getMarketBalance', { address });
    };

    public getValidators = async (): Promise<IResult<IKycValidator[]>> => {
        return this.ipc.send('market.getValidators');
    };

    public getWorkers = async (
        address: string,
    ): Promise<IResult<IWorker[]>> => {
        return this.ipc.send('worker.list', { address });
    };

    public getKYCLink = async (
        password: string,
        address: string,
        kycAddress: string,
        fee: string,
    ): Promise<IResult<string>> => {
        return this.ipc.send('getKYCLink', {
            password,
            address,
            kycAddress,
            fee,
        });
    };

    public async getTokenExchangeRate(): Promise<IResult<string>> {
        return this.ipc.send('getTokenExchangeRate');
    }

    public send = async (
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> => {
        return this.ipc.send('account.send', { ...tx, password });
    };

    public deposit = async (
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> => {
        return this.ipc.send('account.deposit', { ...tx, password });
    };

    public withdraw = async (
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> => {
        return this.ipc.send('account.withdraw', { ...tx, password });
    };

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
(window as any).__api = Api;
// debugger; // ToDo a
export default Api;
