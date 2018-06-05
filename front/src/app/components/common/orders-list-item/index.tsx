import * as React from 'react';
import { IOrdersListItemProps } from './types';
import { Balance } from '../balance-view';
import * as cn from 'classnames';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { BenchmarkShort } from 'app/components/common/benchmark-short';

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
                {/* Column 1 - Main Info */}
                <ProfileBrief
                    className="orders-list-item__account"
                    profile={this.props.order.creator}
                    showBalances={false}
                    logoSizePx={50}
                />

                {/* Column 2 - Indicators */}
                {
                    <BenchmarkShort
                        data={this.props.order.benchmarkMap}
                        className="orders-list-item__benchmark"
                    />
                }

                {/* Column3 - Costs */}
                <div className="orders-list-item__cost">
                    <Balance
                        balance={this.props.order.price}
                        decimalPointOffset={18}
                        decimalDigitAmount={4}
                        symbol="USD/h"
                        round
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
