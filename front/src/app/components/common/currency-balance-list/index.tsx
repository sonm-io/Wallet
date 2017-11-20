import * as React from 'react';
import { IdentIcon } from '../ident-icon';
import * as cn from 'classnames';

export interface ICurrencyInfo {
    symbol: string;
    balance: string;
    address: string;
}

export interface ICurrencyBalanceListProps {
    className?: string;
    currencyBalanceList: ICurrencyInfo[];
}

export class CurrencyBalanceList extends React.Component<ICurrencyBalanceListProps, any> {
    public render() {
        const {
            className,
            currencyBalanceList,
        } = this.props;

        return (
            <div className={cn('sonm-currency-balance-list', className)}>
                <h2 className="sonm-currency-balance-list__header">
                    MY TOKENS
                </h2>
                <ul className="sonm-currency-balance-list__list" >
                    {currencyBalanceList.map(({ symbol, balance, address }) => {
                        return (
                            <li className="sonm-currency-balance-list__item" key={address}>
                                <IdentIcon address={address} width={26} className="sonm-currency-balance-list__icon"/>
                                <span className="sonm-currency-balance-list__balance" style={{ lineHeight: '26px' }}>
                                    {balance} {symbol}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default CurrencyBalanceList;
