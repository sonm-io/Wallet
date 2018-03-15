import { IWalletList } from '../app/api/types';
import moveDecimalPoint from 'app/utils/move-decimal-point';

const migrations = {
    wallet_list: {
        0: (list: any) => {
            const newList = {
                version: 1,
                data: [],
            } as IWalletList;

            for (const item of list.data) {
                newList.data.push({
                    name: item,
                    chainId: 'rinkeby',
                    nodeUrl: 'https://rinkeby.infura.io',
                });
            }

            return newList;
        },
    },

    wallet: {
        0: (data: any) => {
            data.version = 1;

            data.settings = {
                chainId: 'rinkeby',
                nodeUrl: 'https://rinkeby.infura.io',
            };

            data.tokens = [];

            return data;
        },
        1: (data: any) => {
            data.version = 2;

            for (const transaction of data.transactions) {
                transaction.decimalPointOffset = 18;
                transaction.fee = moveDecimalPoint(transaction.fee, 18);
                if (transaction.currencySymbol === 'Ether') {
                    transaction.amount = moveDecimalPoint(
                        transaction.amount,
                        18,
                    );
                }
            }

            return data;
        },
    },
} as any;

export function migrate(type: string, data: any) {
    if (!data.version) {
        if (type === 'wallet_list') {
            data = {
                version: 0,
                data,
            } as IWalletList;
        } else {
            data.version = 0;
        }
    }

    for (const version in migrations[type]) {
        if (version >= data.version) {
            data = migrations[type][version](data);
        }
    }

    return data;
}
