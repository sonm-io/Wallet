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
                <div className="orders-list-item__column-logo">
                    <div className="orders-list-item__column-logo__logo">
                        {this.props.logoUrl ? (
                            <img src={this.props.logoUrl} />
                        ) : (
                            <IdentIcon address={this.props.address} />
                        )}
                    </div>
                    <div className="orders-list-item__column1">
                        <div className="orders-list-item__row">
                            <div className="orders-list-item__label1">
                                Name:
                            </div>
                            <div className="orders-list-item__name">
                                {this.props.name}
                            </div>
                        </div>
                        <div className="orders-list-item__row">
                            <div className="orders-list-item__label1">
                                Account:
                            </div>
                            <div className="orders-list-item__account">
                                {this.props.account}
                            </div>
                        </div>
                        <div className="orders-list-item__row">
                            <div className="orders-list-item__label1">
                                Status:
                            </div>
                            <ProfileStatus status={this.props.status} />
                        </div>
                    </div>
                </div>
                <div className="orders-list-item__column2">
                    <div className="orders-list-item__row">
                        <div className="orders-list-item__label2">
                            CPU count:
                        </div>
                        <div className="orders-list-item__value">
                            {this.props.cpuCount}
                        </div>
                    </div>
                    <div className="orders-list-item__row">
                        <div className="orders-list-item__label2">
                            GPU count:
                        </div>
                        <div className="orders-list-item__value">
                            {this.props.gpuCount}
                        </div>
                    </div>
                    <div className="orders-list-item__row">
                        <div className="orders-list-item__label2">
                            Ram size:
                        </div>
                        <div className="orders-list-item__value">
                            {this.props.ramSize} MB
                        </div>
                    </div>
                </div>
                <div className="orders-list-item__column3">
                    <div className="orders-list-item__value">
                        {this.props.usdPerHour} USD/h
                    </div>
                    <div className="orders-list-item__value">
                        {this.props.duration} hours
                    </div>
                    <div>&nbsp;</div>
                </div>
            </div>
        );
    }
}

export default OrdersListItem;
export * from './types';
