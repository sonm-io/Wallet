import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { roundOrCrop } from './private';

export const balance = (
    value?: string,
    decimalDigitAmount: number = 4,
    decimalPointOffset: number = 18,
    round?: boolean,
): string => {
    let result = '';
    if (value !== undefined && value !== '') {
        result = moveDecimalPoint(value, -decimalPointOffset);
        result = roundOrCrop(result, decimalDigitAmount, round);
    }
    return result;
};
