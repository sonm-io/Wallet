// import { createPromise } from './ipc';
import {
    ISendTransactionResult,
    IAccountInfo,
    ICurrencyInfo,
    ISendTransaction,
    IResult,
} from './types';
// FIXME remove
import * as mock from './mock';
export * from './types';

export class Api {
    public static async setSecretKey(
        password: string,
        name: string,
    ): Promise<IResult<boolean>> {
        let validation;
        let data = true;

        if (password !== 'my secret key') {
            validation = {
                password: 'invalid_master_password',
            };
            data = false;
        }

        await mock.delay(10);

        return {
            data,
            validation,
        };
    }

    public static async addAccount(
        jsonRaw: string,
        password: string,
        name: string,
    ): Promise<IResult<IAccountInfo>> {
        await mock.delay(10);

        return {
            data: mock.newAccount,
        };
    }

    public static async removeAccount(
        address: string,
    ): Promise<IResult<boolean>> {
        await mock.delay(10);

        return { data: true };
    }

    public static async renameAccount(
        address: string,
        name: string,
    ): Promise<IResult<boolean>> {
        await mock.delay(10);

        return { data: true };
    }

    public static async getAccountList(): Promise<IResult<IAccountInfo[]>> {
        await mock.delay(10);

        return mock.accountListResult;
    }

    public static async getCurrencyList(): Promise<IResult<ICurrencyInfo[]>> {
        await mock.delay(10);

        return mock.currencyListResult;
    }

    public static async send(
        tx: ISendTransaction,
        password: string,
    ): Promise<IResult<ISendTransactionResult>> {
        await mock.delay(10);

        return mock.send(tx, password);
    }

    public static async getSendTransactionList(
        filters?: {
            currencyAddress?: string;
            toAddress?: string;
            fromAddress?: string;
            timeStart?: number;
            timeEnd?: number;
        },
        limit?: number,
        offset?: number,
    ): Promise<IResult<[ISendTransactionResult[], number]>> {
        await mock.delay(1000);

        return mock.transactionListResult;
    }

    public static async getGasPrice(): Promise<IResult<string>> {
        await mock.delay(10);

        return { data: '10000' };
    }
}

export default Api;
