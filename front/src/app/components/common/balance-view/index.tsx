import * as React from 'react';

interface IBalanceViewProps {
    className: string;
    balance?: string;
    symbol?: string;
    fullString?: string;
    fontSizePx?: number;
    decimals?: number;
}

import * as cn from 'classnames';

export class Balance extends React.Component<IBalanceViewProps, any> {
    public static defaultProps: Partial<IBalanceViewProps> = {
        fontSizePx: 100,
        decimals: 4,
    };

    public render() {
        const { className, fontSizePx, fullString } = this.props;
        let { balance, symbol } = this.props;

        if (fullString) {
            [balance, symbol] = fullString.split(' ');
        }

        let out = '0';
        if (balance) {
            const dotIdx = balance.indexOf('.');

            out = (dotIdx !== -1)
                ? balance.slice(0, dotIdx + 1 + (this.props.decimals as number))
                : balance;
        }

        return (
            <div
                className={cn('sonm-balance', className)}
                style={{ fontSize: `${fontSizePx}px` }}
            >
                <span className="sonm-balance__symbol">
                    {symbol}
                </span>
                <span className="sonm-balance__number">
                    {out}
                </span>
            </div>
        );
    }
}

export default Balance;
