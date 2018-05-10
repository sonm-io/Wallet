import * as React from 'react';

interface IBalanceViewProps {
    className?: string;
    balance?: string;
    symbol?: string;
    decimalDigitAmount?: number;
    prefix?: string;
    decimalPointOffset: number;
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

    public render() {
        const {
            className,
            prefix,
            decimalPointOffset,
            decimalDigitAmount = 4,
        } = this.props;
        const { balance, symbol } = this.props;
        let num;

        if (balance) {
            num = moveDecimalPoint(balance, -decimalPointOffset);

            num = Balance.limitDecimalDigitAmount(num, decimalDigitAmount);
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
