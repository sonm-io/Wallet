import * as React from 'react';
import { DeletableItemWithConfirmation } from '../deletable-item/with-confirmation';
import * as cn from 'classnames';
import { ITokenItemProps, TokenItem } from './sub/item/index';
import { TokenDeleteConfirmation } from './sub/delete-confirmation';

export interface ICurrencyDetails {
    symbol: string;
    balance: string;
    address: string;
    name: string;
    decimalPointOffset: number;
}

export interface ICurrencyBalanceListProps {
    className?: string;
    currencyBalanceList: ICurrencyDetails[];
    onRequireAddToken?: () => void;
    onDeleteToken: (address: string) => void;
}

class DeletableToken extends DeletableItemWithConfirmation<ITokenItemProps> {}

export class CurrencyBalanceList extends React.Component<
    ICurrencyBalanceListProps,
    any
> {
    protected handleRequireAddToken = (event: any) => {
        event.preventDefault();

        if (this.props.onRequireAddToken) {
            this.props.onRequireAddToken();
        }
    };

    public render() {
        const { className, currencyBalanceList } = this.props;

        if (currencyBalanceList.length === 0) {
            return null;
        }

        return (
            <div className={cn('sonm-currency-balance-list', className)}>
                <h2 className="sonm-currency-balance-list__header">MY FUNDS</h2>
                <ul className="sonm-currency-balance-list__list">
                    {currencyBalanceList.map((tokenProps, idx) => {
                        return (
                            <li
                                className="sonm-currency-balance-list__item"
                                key={tokenProps.address}
                            >
                                {idx > 1 ? (
                                    <DeletableToken
                                        item={tokenProps}
                                        Confirmation={TokenDeleteConfirmation}
                                        onDelete={this.props.onDeleteToken}
                                        id={tokenProps.address}
                                    >
                                        <TokenItem {...tokenProps} />
                                    </DeletableToken>
                                ) : (
                                    <TokenItem {...tokenProps} />
                                )}
                            </li>
                        );
                    })}
                    {this.props.onRequireAddToken && (
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
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default CurrencyBalanceList;
