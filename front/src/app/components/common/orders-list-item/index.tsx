import * as React from 'react';
import { ProfileStatus } from '../profile-status';
import { IOrdersListItemProps } from './types';
import { IdentIcon } from '../ident-icon';
import { Balance } from '../balance-view';
import * as cn from 'classnames';
import { Hash } from '../hash-view';

export class OrdersListItem extends React.Component<IOrdersListItemProps, any> {
    public render() {
        return (
            <div className={cn('orders-list-item', this.props.className)}>
                <div className="orders-list-item__logo">
                    {this.props.logoUrl ? (
                        <img src={this.props.logoUrl} />
                    ) : (
                        <IdentIcon address={this.props.profileAddress} />
                    )}
                </div>

                {/* Column 1 - Main Info */}
                <div className="orders-list-item__main">
                    {this.props.profileName ? (
                        <div className="orders-list-item__main-row">
                            <span className="orders-list-item__main-label">
                                Name:
                            </span>
                            <span className="orders-list-item__main-value">
                                {this.props.profileName}
                            </span>
                        </div>
                    ) : null}

                    <div className="orders-list-item__main-row">
                        <span className="orders-list-item__main-label">
                            Account:
                        </span>
                        <Hash
                            className="orders-list-item__main-value"
                            hash={this.props.profileAddress}
                        />
                    </div>

                    <div className="orders-list-item__main-row">
                        <span className="orders-list-item__main-label">
                            Status:
                        </span>
                        <ProfileStatus
                            className="orders-list-item__main-value"
                            status={this.props.profileStatus}
                        />
                    </div>
                </div>

                {/* Column 2 - Indicators */}
                {Array.from(
                    this.props.schemaOfCustomField.map(([title, key], idx) => (
                        <React.Fragment key={key}>
                            <div className="orders-list-item__indicator-name">
                                {title}
                            </div>
                            <div className="orders-list-item__indicator-value">
                                {(this.props.order as any)[key]}
                            </div>
                        </React.Fragment>
                    )),
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

                {this.props.duration ? (
                    <div className="orders-list-item__cost">
                        {this.props.duration} hour(s)
                    </div>
                ) : null}

                <div className="orders-list-item__child">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default OrdersListItem;
export * from './types';
