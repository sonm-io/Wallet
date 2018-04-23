import * as t from './types';

const VASYA_ADDR = '0x88057f14236687831e1fd205e8efb9e45166fe72';
const PETYA_ADDR = '0xfd0c80ba15cbf19770319e5e76ae05012314608f';

const ETHER_ADDR = '0x';
const SONM_ADDR = '0x00000000000000000000000000330000000000';

export async function delay(timeout: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, timeout));
}

export const newAccount: t.IAccountInfo = {
    name: 'new',
    address: '0x1234567890123456789012345678901234567890',
    json: '',
    currencyBalanceMap: {
        [SONM_ADDR]: '1',
    },
};

export const transactionListResult: t.IResult<
    [t.ISendTransactionResult[], number]
> = {
    data: [
        [
            {
                timestamp: Date.now(),
                fromAddress: VASYA_ADDR,
                toAddress: PETYA_ADDR,
                amount: 'amount',
                currencyAddress: ETHER_ADDR,
                currencySymbol: 'ETH',
                gasPrice: '294',
                gasLimit: '453',
                fee: '198',
                confirmCount: 0,
                status: t.TransactionStatus.failed,
                hash: 'hash1',
                decimalPointOffset: 18,
            },
            {
                timestamp: Date.now(),
                fromAddress: PETYA_ADDR,
                toAddress: VASYA_ADDR,
                amount: 'amount',
                currencyAddress: SONM_ADDR,
                currencySymbol: 'SNM',
                gasPrice: '294',
                gasLimit: '453',
                fee: '198',
                confirmCount: 0,
                status: t.TransactionStatus.success,
                hash: 'hash2',
                decimalPointOffset: 18,
            },
        ],
        100,
    ],
};

export const currencyListResult: t.IResult<t.ICurrencyInfo[]> = {
    data: [
        {
            symbol: 'ETH',
            name: 'Etherium',
            address: ETHER_ADDR,
            decimalPointOffset: 18,
            balance: '0',
        },
        {
            symbol: 'SNMT',
            name: 'Sonm token',
            address: SONM_ADDR,
            decimalPointOffset: 18,
            balance: '0',
        },
    ],
};

export const accountListResult: t.IResult<t.IAccountInfo[]> = {
    data: [
        {
            name: 'Vasya',
            address: VASYA_ADDR,
            json: '',
            currencyBalanceMap: (currencyListResult.data as t.ICurrencyInfo[]).reduce(
                (acc: t.ICurrencyBalanceMap, currency) => {
                    acc[currency.address] = String(Math.random() * 100).substr(
                        0,
                        15,
                    );

                    return acc;
                },
                {},
            ),
        },
        {
            name: 'Petya',
            address: PETYA_ADDR,
            json: '',
            currencyBalanceMap: (currencyListResult.data as t.ICurrencyInfo[]).reduce(
                (acc: t.ICurrencyBalanceMap, currency) => {
                    acc[currency.address] = String(Math.random() * 100).substr(
                        0,
                        15,
                    );

                    return acc;
                },
                {},
            ),
        },
    ],
};

export function send(
    params: t.ISendTransaction,
    password: string,
): t.IResult<t.ISendTransactionResult> {
    const result: t.IResult<t.ISendTransactionResult> = {
        validation: undefined,
        data: undefined,
    };

    if (password !== '12345678') {
        result.validation = {
            password: 'wrong_password',
        };
    } else {
        result.data = {
            hash: 'hach',
            status: t.TransactionStatus.pending,
            timestamp: Date.now(),
            fromAddress: params.fromAddress,
            toAddress: params.toAddress,
            amount: params.amount,
            fee: '0.0001',
            currencyAddress: params.currencyAddress,
            currencySymbol: 'ETH',
            decimalPointOffset: 18,
            confirmCount: 30,
            gasPrice: '345',
            gasLimit: '1234',
        };
    }

    return result;
}

export const profileListResult: t.IResult<t.IProfileListResult> = {
    data: {
        records: [
            {
                name: 'Vasya',
                address: '0x1234567890`123456789012345678901234567890',
                buyOrders: 99,
                sellOrders: 88,
                deals: 98,
                country: 'ru',
                isPro: true,
                isCorp: true,
                status: t.ProfileStatus.anon,
            },
            {
                name: undefined,
                address: '0x1234567890123456789012345678901234567893',
                buyOrders: 99,
                sellOrders: 88,
                deals: 98,
                country: 'ru',
                isPro: true,
                isCorp: true,
                status: t.ProfileStatus.anon,
            },
            {
                name: 'Ololan Ololoshevich',
                address: '0x1234567890123456789012345678901234567895',
                buyOrders: 99,
                sellOrders: 88,
                deals: 98,
                country: 'gb',
                isPro: true,
                isCorp: true,
                status: t.ProfileStatus.anon,
            },
            {
                name: 'BG',
                address: '0x1234562890123456789013345678901234567897',
                buyOrders: 99,
                sellOrders: 88,
                deals: 98,
                country: 'us',
                isPro: true,
                isCorp: true,
                status: t.ProfileStatus.anon,
            },
        ],
        total: 5,
    },
};

// export function send(tx: any) {
//     console.log('send!!!');
// }
