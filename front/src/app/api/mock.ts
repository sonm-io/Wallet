import * as t from './types';

const VASYA_ADDR = '0x88057f14236687831e1fd205e8efb9e45166fe72';
const PETYA_ADDR = '0xfd0c80ba15cbf19770319e5e76ae05012314608f';

const ETHER_ADDR = '0x';
const SONM_ADDR = '0x00000000000000000000000000330000000000';

export async function delay(timeout: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, timeout));
}

export const transactionListResult: t.IResult<t.ISendTransactionResult[]> = {
    data: [
        {
            timestamp: Date.now(),
            fromAddress: VASYA_ADDR,
            toAddress: PETYA_ADDR,
            amount: '100',
            currencyAddress: SONM_ADDR,
            confirmCount: 30,
            fee: '0.00001',
        },

        {
            timestamp: Date.now() + 1,
            toAddress: VASYA_ADDR,
            fromAddress: PETYA_ADDR,
            amount: '55',
            currencyAddress: ETHER_ADDR,
            confirmCount: 30,
            fee: '0.00021',
        },
    ],
}

export const currencyListResult: t.IResult<t.ICurrencyInfo[]> = {
    data: [
        {
            symbol: 'ETH',
            name: 'Etherium',
            address: ETHER_ADDR,
        },
        {
            symbol: 'SNMT',
            name: 'Sonm token',
            address: SONM_ADDR,
        },
    ],
};

export const accountListResult: t.IResult<t.IAccountInfo[]> = {
    data: [
        {
            name: 'Vasya',
            address: VASYA_ADDR,
            currencyBalanceMap: (currencyListResult.data as t.ICurrencyInfo[]).reduce(
                (acc: t.ICurrencyBalanceMap, currency) => {
                    acc[currency.address] = String(Math.random() * 100).substr(0, 15);

                    return acc;
                }, {}),
        },
        {
            name: 'Petya',
            address: PETYA_ADDR,
            currencyBalanceMap: (currencyListResult.data as t.ICurrencyInfo[]).reduce(
                (acc: t.ICurrencyBalanceMap, currency) => {
                    acc[currency.address] = String(Math.random() * 100).substr(0, 15);

                    return acc;
                }, {}),
        },
    ],
};

export function send(params: t.ISendTransactionParams): t.IResult<t.ISendTransactionResult> {
    const result: t.IResult<t.ISendTransactionResult> = {
        validation: undefined,
        data: undefined,
    };

    if (params.password !== '12345678') {
        result.validation = {
            password: 'wrong_password',
        };
    } else {
        result.data = {
            timestamp: Date.now(),
            fromAddress: params.fromAddress,
            toAddress: params.toAddress,
            amount: params.amount,
            fee: '0.0001',
            currencyAddress: params.currencyAddress,
            confirmCount: 30,
        };
    }

    return result;
}
