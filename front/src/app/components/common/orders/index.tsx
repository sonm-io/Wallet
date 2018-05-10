import * as React from 'react';
import { OrdersListItem } from '../orders-list-item';
import { ListHeader } from '../list-header';
import { IOrdersProps } from './types';

export class Orders extends React.Component<IOrdersProps, any> {
    constructor(props: IOrdersProps) {
        super(props);
    }

    public render() {
        return (
            <div className="orders">
                <ListHeader {...this.props.header} className="orders__header" />
                <div className="orders__list">
                    {this.props.list.map(order => (
                        <OrdersListItem {...order} key={order.account} />
                    ))}
                </div>
            </div>
        );
    }
}
