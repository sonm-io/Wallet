import * as t from 'tcomb';
import { isDigits, isHexDeximal } from 'app/api/runtime-types-common';

export interface ICurrencyInfo {
    symbol: string;
    decimalPointOffset: number;
    name: string;
    address: string;
    balance: string;
}

export const TypeCurrencyAddress = t.refinement(
    t.String,
    (s: string) => s === '0x' || s === '0x1' || Boolean(TypeEthereumAddress(s)),
    'CurrencyAddress',
);

export interface ICurrencyBalanceMap {
    [address: string]: string; // address => balance
}

export const TypeCurrencyBalanceMap = t.irreducible(
    'CurrencyBalanceMap',
    (x: any) =>
        x !== null &&
        typeof x === 'object' &&
        Object.keys(x).every(
            key => Boolean(TypeCurrencyAddress(key)) && isDigits(x[key]),
        ),
);

export const TypeEthereumAddress = t.refinement(
    t.String,
    (s: string) => s.length === 42 && s.startsWith('0x') && isHexDeximal(s),
    'EthereumAddress',
);
