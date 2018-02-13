import * as BigNumber from 'bignumber.js';

export function createBigNumber(value: string, dp?: number) {
    try {
        const bn  = new BigNumber(value);

        return dp
            ? new BigNumber(bn.toFixed(dp))
            : bn;
    } catch (e) {
        return undefined;
    }
}

export default createBigNumber;
