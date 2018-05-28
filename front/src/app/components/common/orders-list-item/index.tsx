import * as React from 'react';
import { ProfileStatus } from '../profile-status';
import { IOrdersListItemProps } from './types';
import { IdentIcon } from '../ident-icon';
import { Balance } from '../balance-view';
import * as cn from 'classnames';
import { Hash } from '../hash-view';
import { EnumProfileStatus } from 'app/api/types';

export class OrdersListItem extends React.Component<IOrdersListItemProps, any> {
    protected handleClick = (event: any) => {
        event.preventDefault();

        this.props.onClick(this.props.order);
    };

    public render() {
        return (
            <a
                className={cn('orders-list-item', this.props.className)}
                href={`#order-i-${this.props.order.id}`}
                onClick={this.handleClick}
            >
                <div className="orders-list-item__logo">
                    {this.props.logoUrl ? (
                        <img src={this.props.logoUrl} />
                    ) : (
                        <IdentIcon address={this.props.order.creator.address} />
                    )}
                </div>

                {/* Column 1 - Main Info */}
                <div className="orders-list-item__main">
                    {this.props.order.creator.name ? (
                        <React.Fragment>
                            <span className="orders-list-item__main-label">
                                Name:
                            </span>
                            <span className="orders-list-item__main-value">
                                {this.props.order.creator.name}
                            </span>
                        </React.Fragment>
                    ) : null}

                    <span className="orders-list-item__main-label">
                        Account:
                    </span>
                    <Hash
                        className="orders-list-item__main-value"
                        hash={this.props.order.creator.address}
                    />

                    <span className="orders-list-item__main-label">
                        Status:
                    </span>
                    <ProfileStatus
                        className="orders-list-item__main-value"
                        status={
                            this.props.order.creator.status ||
                            EnumProfileStatus.anon
                        }
                    />
                </div>

                {/* Column 2 - Indicators */}
                {this.props.schemaOfCustomField.map(([key, title], idx) => (
                    <React.Fragment key={key}>
                        <div className="orders-list-item__indicator-name">
                            {title}
                        </div>
                        <div className="orders-list-item__indicator-value">
                            {(this.props.order as any)[key]}
                        </div>
                    </React.Fragment>
                ))}

                {/* Column3 - Costs */}
                <div className="orders-list-item__cost">
                    <Balance
                        balance={this.props.order.price}
                        decimalPointOffset={18}
                        decimalDigitAmount={2}
                        symbol="USD/h"
                    />
                </div>

                {this.props.order.duration ? (
                    <div className="orders-list-item__cost">
                        {this.props.order.duration} hour(s)
                    </div>
                ) : null}

                <div className="orders-list-item__child">
                    {this.props.children}
                </div>
            </a>
        );
    }
}

export default OrdersListItem;
export * from './types';
