import { moveDecimalPoint } from 'app/utils/move-decimal-point';

export class BalanceUtils {
    public static formatBalance = (
        value?: string,
        decimalDigitAmount: number = 4,
        decimalPointOffset: number = 18,
        round?: boolean,
    ): string => {
        let result = '';
        if (value !== undefined && value !== '') {
            result = moveDecimalPoint(value, -decimalPointOffset);
            result = BalanceUtils.roundOrCrop(
                result,
                decimalDigitAmount,
                round,
            );
        }
        return result;
    };

    protected static roundOrCrop = (
        num: string,
        decimalDigitAmount: number,
        round?: boolean,
    ): string => {
        let result = BalanceUtils.limitDecimalDigitAmount(
            num,
            decimalDigitAmount + 1,
        );
        const pointIndex = result.indexOf('.');
        if (
            pointIndex > -1 &&
            result.substr(pointIndex + 1).length > decimalDigitAmount
        ) {
            result = BalanceUtils.roundLastNumberPosition(result, !round);
        }
        return result;
    };

    protected static limitDecimalDigitAmount = (
        num: string,
        decimalDigitAmount: number,
    ) => {
        const dotIdx = num.indexOf('.');
        return dotIdx !== -1
            ? num.slice(0, dotIdx + 1 + decimalDigitAmount)
            : num;
    };

    protected static roundLastNumberPosition = (
        num: string,
        justCutOff?: boolean,
    ) => {
        let result = num;

        if (num.indexOf('.') > 0) {
            const lastIdx = num.length - 1;
            if (justCutOff || num[lastIdx] === '0') {
                result = num.slice(0, lastIdx);
            } else {
                const last = Number(num[lastIdx]);
                if (last < 5) {
                    result = num.slice(0, lastIdx);
                } else {
                    let idx = lastIdx - 1;
                    while (num[idx] === '9') {
                        --idx;
                    }
                    if (num[idx] === '.') {
                        result = BalanceUtils.increaseInteger(
                            num.slice(0, idx),
                        );
                    } else {
                        const digit = Number(num[idx]);
                        result = num.slice(0, idx) + Number(digit + 1);
                    }
                }
            }
            result = BalanceUtils.removeTrailingPoint(result);
        }
        return result;
    };

    protected static removeTrailingPoint = (str: string) => {
        const len = str.length;
        return str[len - 1] === '.' ? str.slice(0, len - 1) : str;
    };

    protected static increaseInteger = (n: string) => {
        let i = n.length - 1;
        while (i >= 0 && n[i] === '9') {
            i--;
        }
        if (i === -1) {
            return '1' + '0'.repeat(n.length);
        }
        return (
            n.substr(0, i - 1) +
            (Number(n[i]) + 1) +
            '0'.repeat(n.length - i - 1)
        );
    };
}
