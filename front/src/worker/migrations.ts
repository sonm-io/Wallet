import {
    IWalletList,
} from '../app/api/types';

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

            return data;
        },
    },
} as any;

module.exports = function migrate(type: string, data: any) {
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
};
