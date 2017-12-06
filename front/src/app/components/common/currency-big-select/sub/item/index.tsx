import * as React from 'react';
import * as cn from 'classnames';

export interface ICurrencyItemProps {
    className?: string;
    address: string;
    name: string;
    symbol: string;
    balance: string;
    decimals: number;
}

export class CurrencyItem extends React.Component<ICurrencyItemProps, any> {
    public render() {
        const {
            className,
            balance,
            name,
            symbol,
        } = this.props;

        return (
            <div className={cn('sonm-currency-item', className)}>
                <span className="sonm-currency-item__name">{name}</span>
                <span className="sonm-currency-item__amount">{balance}</span>
                <span className="sonm-currency-item__symbol">{symbol}</span>
            </div>
        );
    }
}

export default CurrencyItem;
