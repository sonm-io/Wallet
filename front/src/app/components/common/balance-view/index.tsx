import * as React from 'react';

interface IBalanceViewProps {
    className?: string;
    balance?: string;
    symbol?: string;
    decimalDigitAmount?: number;
    prefix?: string;
    decimalPointOffset: number;
    round?: boolean;
}

import * as cn from 'classnames';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';

export class Balance extends React.PureComponent<IBalanceViewProps, any> {
    protected static limitDecimalDigitAmount(
        num: string,
        decimalDigitAmount: number,
    ) {
        const dotIdx = num.indexOf('.');

        return dotIdx !== -1
            ? num.slice(0, dotIdx + 1 + decimalDigitAmount)
            : num;
    }

    public static roundLastNumberPosition(num: string, justCutOff?: boolean) {
        let result = num;

        const lastIdx = num.length - 1;
        if (justCutOff) {
            result = num.slice(0, lastIdx);
        } else {
            const last = Number(num[lastIdx]);
            if (last < 5) {
                result = num.slice(0, lastIdx);
            } else {
                const last2 = Number(num[lastIdx - 1]);
                if (last2 === 9) {
                    const last3 = Number(num[lastIdx - 2]);
                    result = num.slice(0, lastIdx - 2) + String(last3 + 1);
                } else {
                    result = num.slice(0, lastIdx - 1) + Number(last2 + 1);
                }
            }
        }

        return result;
    }

    public render() {
        const {
            className,
            prefix,
            decimalPointOffset,
            decimalDigitAmount = 4,
            round,
        } = this.props;
        const { balance, symbol } = this.props;
        let num = '';

        if (balance) {
            num = moveDecimalPoint(balance + '0', -decimalPointOffset - 1);

            num = Balance.limitDecimalDigitAmount(num, decimalDigitAmount + 1);
        }

        if (num.indexOf('.') > 0) {
            num = Balance.roundLastNumberPosition(num, !round);
        }

        return (
            <div className={cn('sonm-balance', className)}>
                <span className="sonm-balance__number">
                    {prefix ? `${prefix} ` : null}
                    {num}
                </span>
                {symbol ? (
                    <span className="sonm-balance__symbol">{symbol}</span>
                ) : null}
            </div>
        );
    }
}

export default Balance;
