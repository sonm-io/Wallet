import * as React from 'react';
import { IdentIcon } from '../ident-icon';
import { Balance } from '../balance-view';
import * as cn from 'classnames';

export interface ICurrencyDetails {
    symbol: string;
    balance: string;
    address: string;
    name: string;
}

export interface ICurrencyBalanceListProps {
    className?: string;
    currencyBalanceList: ICurrencyDetails[];
    onRequireAddToken?: () => void;
}

export class CurrencyBalanceList extends React.Component<ICurrencyBalanceListProps, any> {
    protected handleRequireAddToken = (event: any) => {
        event.preventDefault();

        if (this.props.onRequireAddToken) {
            this.props.onRequireAddToken();
        }
    }

    public render() {
        const {
            className,
            currencyBalanceList,
        } = this.props;

        if (currencyBalanceList.length === 0) { return null; }

        return (
            <div className={cn('sonm-currency-balance-list', className)}>
                <h2 className="sonm-currency-balance-list__header">
                    MY FUNDS
                </h2>
                <ul className="sonm-currency-balance-list__list" >
                    {currencyBalanceList.map(({ symbol, balance, address }) => {
                        return (
                            <li className="sonm-currency-balance-list__item" key={address}>
                                <IdentIcon address={address} width={26} className="sonm-currency-balance-list__icon"/>
                                <Balance
                                    className="sonm-currency-balance-list__balance"
                                    balance={balance}
                                    symbol={symbol}
                                    fontSizePx={18}
                                />
                            </li>
                        );
                    })}
                    {this.props.onRequireAddToken &&
                    <li
                        key="add"
                        className="sonm-currency-balance-list__item"
                    >
                        <a
                            href="#add-token"
                            onClick={this.handleRequireAddToken}
                            className="sonm-currency-balance-list__add-token"
                        >
                            + ADD TOKEN
                        </a>
                    </li>}
                </ul>
            </div>
        );
    }
}

export default CurrencyBalanceList;
