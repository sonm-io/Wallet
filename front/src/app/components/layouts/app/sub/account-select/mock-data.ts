import { IMarketAccountSelectProps } from './index';

let value;

export const props: IMarketAccountSelectProps = {
    value: (value = {
        address: '0x1234567890123456789012345678901234567890',
        name: 'name1',
        currencyBalanceMap: {
            '0x1': '123',
        },
        json: '{a: {}}',
    }),
    accounts: [
        value,
        {
            address: '0x1234567890123456789012345678901234567866',
            name: 'name2',
            currencyBalanceMap: {
                '0x1': '456',
            },
            json: '{b: {}}',
        },
        {
            address: '0x1234567890123456789012345678901234567877',
            name: 'name2',
            currencyBalanceMap: {
                '0x1': '789',
            },
            json: '{c: {}}',
        },
    ],
    url: '/url',
    onChange: (...as: any[]) => {
        console.log(...as);
    },
    hidden: false,
};
