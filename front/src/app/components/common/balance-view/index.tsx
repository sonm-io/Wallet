import * as React from 'react';

interface IBalanceViewProps {
    className: string;
    balance: string;
    symbol: string;
    maxWidthPx?: number;
    fontSizePx?: number;
}

import * as cn from 'classnames';

export class Balance extends React.Component<IBalanceViewProps, any> {
    public defaultProps: Partial<IBalanceViewProps> = {
        maxWidthPx: 100,
        fontSizePx: 100,
    };

    public render() {
        const { className, maxWidthPx, fontSizePx, balance, symbol } = this.props;

        const dotIdx = balance.indexOf('.');

        const out = (dotIdx !== -1)
            ? balance.slice(0, dotIdx + 5)
            : balance;

        return (
            <div
                className={cn('sonm-balance', className)}
                style={{ maxWidth: `${maxWidthPx}px`, fontSize: `${fontSizePx}px` }}
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
