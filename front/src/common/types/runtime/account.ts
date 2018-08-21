import * as t from 'tcomb';
import { isDigits } from 'common/utils';
import { createStruct } from 'app/api/utils/runtime-types-utils';
import { IAccountInfo } from '../account';
import { TypeEthereumAddress } from 'common/types/runtime/etherium-address';

const TypeCurrencyAddress = t.refinement(
    t.String,
    (s: string) => s === '0x' || s === '0x1' || Boolean(TypeEthereumAddress(s)),
    'CurrencyAddress',
);

const TypeCurrencyBalanceMap = t.irreducible(
    'CurrencyBalanceMap',
    (x: any) =>
        x !== null &&
        typeof x === 'object' &&
        Object.keys(x).every(
            key => Boolean(TypeCurrencyAddress(key)) && isDigits(x[key]),
        ),
);

const TypeAccountInfo = createStruct<IAccountInfo>(
    {
        address: TypeEthereumAddress,
        name: t.String,
        marketBalance: t.String,
        marketUsdBalance: t.String,
        currencyBalanceMap: TypeCurrencyBalanceMap,
        json: t.String,
    },
    'IAccountInfo',
);

export const TypeAccountInfoList = t.list(TypeAccountInfo);
