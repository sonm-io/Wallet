import { IWalletList, Wallet } from 'app/entities/wallet';
import moveDecimalPoint from 'app/utils/move-decimal-point';

const migrations = {
    wallet_list: {
        0: (list: any) => {
            const newList: IWalletList = {
                version: 1,
                data: [],
            };

            for (const item of list.data) {
                newList.data.push(
                    new Wallet({
                        name: item,
                        chainId: 'rinkeby',
                        nodeUrl: 'https://rinkeby.infura.io',
                    }),
                );
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
        2: (data: any) => {
            data.version = 3;

            if (data.settings.chainId === 'rinkeby') {
                const newTokenAddress =
                    '0xa2498b16a8fe7cd997f278d2419e3aa3b2b5854c';
                if (data.tokens && data.tokens[1]) {
                    data.tokens[1].address = newTokenAddress;

                    if (data.tokens[1].contract) {
                        data.tokens[1].contract.address = newTokenAddress;
                    }
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
