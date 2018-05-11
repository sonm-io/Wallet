import * as React from 'react';
import { ProfileStatus } from '../profile-status';
import { IOrdersListItemProps } from './types';
import { IdentIcon } from '../ident-icon';
import { Balance } from '../balance-view';
import * as cn from 'classnames';

export class OrdersListItem extends React.Component<IOrdersListItemProps, any> {
    constructor(props: IOrdersListItemProps) {
        super(props);
    }

    public render() {
        return (
            <div className={cn('orders-list-item', this.props.className)}>
                <div className="orders-list-item__logo">
                    {this.props.logoUrl ? (
                        <img src={this.props.logoUrl} />
                    ) : (
                        <IdentIcon address={this.props.address} />
                    )}
                </div>

                {/* Column 1 - Main Info */}
                <div className="orders-list-item__main">
                    {this.props.name ? (
                        <div className="orders-list-item__main-row">
                            <div className="orders-list-item__main-label">
                                Name:
                            </div>
                            <div className="orders-list-item__name">
                                {this.props.name}
                            </div>
                        </div>
                    ) : null}

                    <div className="orders-list-item__main-row">
                        <div className="orders-list-item__main-label">
                            Account:
                        </div>
                        <div className="orders-list-item__account">
                            {this.props.account}
                        </div>
                    </div>
                    <div className="orders-list-item__main-row">
                        <div className="orders-list-item__main-label">
                            Status:
                        </div>
                        <ProfileStatus status={this.props.status} />
                    </div>
                </div>

                {/* Column 2 - Indicators */}
                {Array.from(this.props.customFields.keys()).map(key => (
                    <div
                        className="orders-list-item__indicator-name"
                        key={`indicatorKey:${key}`}
                    >
                        {key}:
                    </div>
                ))}
                {Array.from(this.props.customFields.values()).map(
                    (value, i) => (
                        <div
                            className="orders-list-item__indicator-value"
                            key={`indicatorValueNum:${i}`}
                        >
                            {value}
                        </div>
                    ),
                )}

                {/* Column3 - Costs */}
                <div className="orders-list-item__cost">
                    <Balance
                        balance={this.props.usdPerHour}
                        decimalPointOffset={18}
                        decimalDigitAmount={2}
                        symbol="USD/h"
                    />
                </div>
                <div className="orders-list-item__cost">
                    {this.props.duration} hours
                </div>
            </div>
        );
    }
}

export default OrdersListItem;
export * from './types';
