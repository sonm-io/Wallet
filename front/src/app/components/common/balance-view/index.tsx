import * as React from 'react';

interface IBalanceViewProps {
    className: string;
    balance?: string;
    symbol?: string;
    fullString?: string;
    fontSizePx?: number;
}

import * as cn from 'classnames';

export class Balance extends React.Component<IBalanceViewProps, any> {
    public defaultProps: Partial<IBalanceViewProps> = {
        fontSizePx: 100,
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
                ? balance.slice(0, dotIdx + 5)
                : balance;
        }

        return (
            <div
                className={cn('sonm-balance', className)}
                style={{ fontSize: `${fontSizePx}px` }}
            >
                <div className="sonm-balance__grid">
                    <label className="sonm-balance__number">
                        {out}
                    </label>
                    <label className="sonm-balance__symbol">
                        {symbol}
                    </label>
                </div>
            </div>
        );
    }
}

export default Balance;
