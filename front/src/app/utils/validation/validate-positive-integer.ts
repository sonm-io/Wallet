import { validatePositiveNumber } from './validate-positive-number';

export function validatePositiveInteger(value: string): string[] {
    const result = [];

    const num = Number(value);

    if (num % 1 !== 0) {
        result.push('Value should be positive integer');
    } else {
        result.push(...validatePositiveNumber(value));
    }

    return result;
}

export default validatePositiveInteger;
