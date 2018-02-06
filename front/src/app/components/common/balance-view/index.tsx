import * as React from 'react';

interface IBalanceViewProps {
    className?: string;
    balance?: string;
    symbol?: string;
    fullString?: string;
    fontSizePx?: number;
    decimals?: number;
    prefix?: string;
}

import * as cn from 'classnames';
import trimZeros from 'app/utils/trim-zeros';

export class Balance extends React.PureComponent<IBalanceViewProps, any> {
    public static defaultProps: Partial<IBalanceViewProps> = {
        decimals: 4,
    };

    public render() {
        const { className, fontSizePx, fullString, prefix } = this.props;
        let { balance, symbol } = this.props;

        if (fullString) {
            [balance, symbol] = fullString.split(' ');
        }

        let out = '';
        if (balance) {
            const dotIdx = balance.indexOf('.');

            out = (dotIdx !== -1)
                ? balance.slice(0, dotIdx + 1 + (this.props.decimals as number))
                : balance;
        }

        out = trimZeros(out);

        const style = fontSizePx
            ? { fontSize: `${fontSizePx}px` }
            : undefined;

        return (
            <div
                className={cn('sonm-balance', className)}
                style={style}
            >
                <span className="sonm-balance__number">
                    {prefix} {out}
                </span>
                <span className="sonm-balance__symbol">
                    {symbol}
                </span>
            </div>
        );
    }
}

export default Balance;
