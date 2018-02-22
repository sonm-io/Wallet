import { trimZeros } from './trim-zeros';

const zeroString200 = new Array(200).join('0');
export function moveDecimalPoint(
    num: string,
    offs: number,
    precision = +Infinity,
    dotSymbol = '.',
): string {
    let result = num;

    if (typeof offs === 'number' && offs !== 0) {
        const [a, b = ''] = num.split(dotSymbol);
        const dotIndex = a.length;
        const len = a.length + b.length;
        const newDotIdx = dotIndex + offs;

        if (newDotIdx < 0) {
            result =
                '0' + dotSymbol + zeroString200.slice(0, -newDotIdx) + a + b;
        } else {
            if (newDotIdx === 0) {
                result = '0.' + a + b;
            } else if (newDotIdx > len) {
                result = a + b + zeroString200.slice(0, newDotIdx - len);
            } else {
                const alen = a.length;

                if (newDotIdx > alen) {
                    const bDotIdx = newDotIdx - alen;
                    result =
                        a + b.slice(0, bDotIdx) + dotSymbol + b.slice(bDotIdx);
                } else {
                    result =
                        a.slice(0, newDotIdx) +
                        dotSymbol +
                        a.slice(newDotIdx) +
                        b;
                }
            }
        }
    }

    if (precision !== +Infinity) {
        const pointIdx = result.indexOf('.');
        result = result.slice(0, pointIdx + precision + 1);
    }

    result = trimZeros(result);

    return result;
}

export default moveDecimalPoint;
