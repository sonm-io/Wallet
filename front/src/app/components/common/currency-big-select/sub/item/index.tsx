import * as React from 'react';
import * as cn from 'classnames';

export interface ICurrencyItemProps {
    className?: string;
    address: string;
    fullName: string;
    symbol: string;
    amount?: string;
}

export class CurrencyItem extends React.Component<ICurrencyItemProps, any> {
    public render() {
        const {
            className,
            amount,
            fullName,
            symbol,
        } = this.props;

        return (
            <div className={cn('sonm-currency-item', className)}>
                <span className="sonm-currency-item__name">{fullName}</span>
                <span className="sonm-currency-item__amount">{amount}</span>
                <span className="sonm-currency-item__symbol">{symbol}</span>
            </div>
        );
    }
}

export default CurrencyItem;
