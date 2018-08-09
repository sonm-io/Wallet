import { validatePositiveNumber } from './validate-positive-number';

export function validateNumberPositiveNumberWithMin(
    value: string,
    minimum: string,
    dotSymbol = '.',
): string[] {
    const result = validatePositiveNumber(value, dotSymbol);

    if (result.length === 0) {
        const min = Number(minimum);
        const val = Number(value);

        if (val - min < Number.EPSILON) {
            result.push(`Minimum value: ${minimum}`);
        }
    }

    return result;
}

export default validateNumberPositiveNumberWithMin;
