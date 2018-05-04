import { IMarketAccountSelectProps } from './index';

let value;

export const marketAccountSelectProps: IMarketAccountSelectProps = {
    value: (value = {
        address: '0x1234567890123456789012345678901234567890',
        name: 'name1',
        primaryTokenBalance: '1234124.12',
        usdBalance: '456723.12',
    }),
    accounts: [
        value,
        {
            address: '0x1234567890123456789012345678901234567866',
            name: 'name2',
            primaryTokenBalance: '1000000.12',
            usdBalance: '56723.12',
        },
        {
            address: '0x1234567890123456789012345678901234567877',
            name: 'name2',
            primaryTokenBalance: '11.12',
            usdBalance: '22.12',
        },
    ],
    onChange() {
        console.log(arguments);
    },
    decimalPointOffset: 18,
};
