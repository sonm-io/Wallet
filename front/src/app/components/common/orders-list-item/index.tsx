import * as React from 'react';
import { ProfileStatus } from '../profile-status';
import { IOrdersListItemProps } from './types';
import { IdentIcon } from '../ident-icon';
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
                    <div className="orders-list-item__main-row">
                        <div className="orders-list-item__main-label">
                            Name:
                        </div>
                        <div className="orders-list-item__name">
                            {this.props.name}
                        </div>
                    </div>
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
                <div className="orders-list-item__indicator-name">
                    CPU count:
                </div>
                <div className="orders-list-item__indicator-value">
                    {this.props.cpuCount}
                </div>
                <div className="orders-list-item__indicator-name">
                    GPU ETH hashrate:
                </div>
                <div className="orders-list-item__indicator-value">
                    {this.props.hashRate} Mh/s
                </div>
                <div className="orders-list-item__indicator-name">
                    Ram size:
                </div>
                <div className="orders-list-item__indicator-value">
                    {this.props.ramSize} MB
                </div>

                {/* Column3 - Costs */}
                <div className="orders-list-item__cost">
                    {this.props.usdPerHour} USD/h
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
