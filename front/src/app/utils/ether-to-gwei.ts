import * as BigNumber from 'bignumber.js';
import { trimZeros } from './trim-zeros';

export function etherToGwei(
    value: string | BigNumber.BigNumber | number,
): string {
    try {
        const v = new BigNumber(value);

        return trimZeros(v.mul(1000000000).toFixed(9));
    } catch (e) {
        return '';
    }
}

export default etherToGwei;
