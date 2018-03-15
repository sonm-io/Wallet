import { ICurrencyInfo } from 'app/api';

export function normalizeCurrencyInfo(currencyInfo: any): ICurrencyInfo {
    const result: ICurrencyInfo = {
        symbol: currencyInfo.symbol,
        decimalPointOffset: currencyInfo.decimals,
        name: currencyInfo.name,
        address: currencyInfo.address,
    };

    return result;
}

export default normalizeCurrencyInfo;
