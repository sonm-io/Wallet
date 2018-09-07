import { ICurrencyInfo } from 'common/types/currency';

export function normalizeCurrencyInfo(currencyInfo: any): ICurrencyInfo {
    const result: ICurrencyInfo = {
        symbol: currencyInfo.symbol,
        decimalPointOffset: currencyInfo.decimals,
        name: currencyInfo.name,
        address: currencyInfo.address,
        balance: currencyInfo.balance,
    };

    return result;
}

export default normalizeCurrencyInfo;
