import * as BigNumber from 'bignumber.js';

export function createBigNumber(value: string, dp: number = 18) {
    try {
        const bn  = new BigNumber(value);
        return new BigNumber(bn.toFixed(dp));
    } catch (e) {
        return undefined;
    }
}

export default createBigNumber;
