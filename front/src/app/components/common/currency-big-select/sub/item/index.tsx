import * as React from 'react';
import * as cn from 'classnames';
import { Balance } from 'app/components/common/balance-view';

export interface ICurrencyItemProps {
    className?: string;
    address: string;
    name: string;
    symbol: string;
    balance: string;
    decimalPointOffset: number;
}

export class CurrencyItem extends React.Component<ICurrencyItemProps, any> {
    public render() {
        const {
            className,
            balance,
            name,
            symbol,
            decimalPointOffset,
        } = this.props;

        return (
            <div className={cn('sonm-currency-item', className)}>
                <span className="sonm-currency-item__name">{name}</span>
                <Balance
                    className="sonm-currency-item__balance"
                    balance={balance}
                    symbol={symbol}
                    decimalPointOffset={decimalPointOffset}
                />
            </div>
        );
    }
}

export default CurrencyItem;
