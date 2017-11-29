// import { createPromise } from './ipc';

import { messages } from './error-messages';
import * as ipc from './ipc';
import {
    ISendTransactionResult,
    IAccountInfo,
    ICurrencyInfo,
    ISendTransactionParams,
    IResult,
    IValidation,
} from './types';

// FIXME remove
// import * as mock from './mock';

export * from './types';

const MAX_DELAY_DEFAULT = 10000;

let count = 0;
function nextRequestId(): string {
    return 'request' + count++;
}

function createPromise(
    type: string,
    payload?: any,
    maxDelay: number = MAX_DELAY_DEFAULT,
): Promise<IResult<any>> {
    return new Promise((done, reject) => {
        const requestId = nextRequestId();

        const callback = (event: any, response: IResult<any>) => {
            if (response.validation) {
                response.validation = processValidation(response.validation);
            }

            if (response.success) {
                console.log(type, response);
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

export class Api {
    public static async setSecretKey(password: string): Promise<IResult<boolean>>  {
        return createPromise('account.setSecretKey', { password });
    }

    public static async hasSavedData(password: string): Promise<IResult<boolean>>  {
        return createPromise('account.hasSavedData');
    }

    public static async addAccount(jsonRaw: string, password: string, name: string): Promise<IResult<IAccountInfo>> {
        return createPromise('account.add', { json: jsonRaw, password, name });
    }

    public static async removeAccount(address: string): Promise<IResult<boolean>> {
        return createPromise('account.remove', { address });
    }

    public static async renameAccount(address: string, name: string): Promise<IResult<boolean>> {
        return createPromise('account.rename', { address, name });
    }

    public static async getAccountList(): Promise<IResult<IAccountInfo[]>> {
        return createPromise('account.list');
    }

    public static async ping(): Promise<IResult<object>> {
        return createPromise('ping', {ping: true});
    }

    public static async getCurrencyList(): Promise<IResult<ICurrencyInfo[]>> {
        return createPromise('account.getCurrencies');
    }

    public static async send(tx: ISendTransactionParams)
    : Promise<IResult<ISendTransactionResult>> {
        return createPromise('account.send', tx);
    }

    // TODO rename to getTransactionList
    public static async getSendTransactionList(
        filters?: {
            currencyAddress?: string,
            toAddress?: string,
            fromAddress?: string,
            timeStart?: number,
            timeEnd?: number,
        },
        limit?: number,
        offset?: number,
    ): Promise<IResult<ISendTransactionResult[]>> {
        return createPromise('transaction.list', { filters, limit, offset});
    }

    public static async getGasPrice(): Promise<IResult<string>> {
        return createPromise('account.getGasPrice');
    }
}

Api.setSecretKey('my secret key');

Api.addAccount(
  `{"address":"fd0c80ba15cbf19770319e5e76ae05012314608f","crypto":{"cipher":"aes-128-ctr","ciphertext":"83b9ea7c8b7f45d4d83704483a666d33b793c18a722557a1af0ea3dd84fd0e64","cipherparams":{"iv":"132e609bb81d9fff9380f828d44df738"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"18fbd1950ec1cfcd5564624152b66c09ce03df7b7b3136f019f746f12de8e8f9"},"mac":"b76158d4109241a4fd5752b06356de52152952cda78382d0cbac41650d58d64c"},"id":"d5c89177-f7c6-4da0-ac20-20b6d5f3dae1","version":3}`,
   'qazwsxedc',
  'Petya',
);

export default Api;
