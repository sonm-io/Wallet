import { BN } from 'bn.js';
export { BN } from 'bn.js';

export const ZERO = new BN('0');
export const ONE = new BN('1');
export const TWO = new BN('2');
export const THREE = new BN('3');

export function createBigNumber(value: string): BN | undefined {
    try {
        return new BN(value);
    } catch (e) {
        return undefined;
    }
}

export function createBigNumberAlways(value: string): BN {
    try {
        return new BN(value);
    } catch (e) {
        return ZERO;
    }
}

export default createBigNumber;
