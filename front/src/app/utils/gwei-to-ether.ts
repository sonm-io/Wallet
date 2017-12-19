import * as BigNumber from 'bignumber.js';
import { trimZeros } from './trim-zeros';

export function gweiToEther(value: string | BigNumber.BigNumber | number): string {
    try {
        const v = new BigNumber(value);

        return trimZeros(v.dividedBy(1000000000).toFixed(18));
    } catch (e) {
        return '';
    }
}

export default gweiToEther;
