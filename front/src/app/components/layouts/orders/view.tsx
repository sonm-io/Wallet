import * as React from 'react';
import { OrdersListItem } from '../../common/orders-list-item';
import { ListHeader } from '../../common/list-header';
import { IOrdersProps } from './types';

export class OrdersView extends React.Component<IOrdersProps, any> {
    constructor(props: IOrdersProps) {
        super(props);
    }

    public render() {
        const { list, ...rest } = this.props;

        return (
            <div className="orders">
                <ListHeader className="orders__header" {...rest} />
                <div className="orders__list">
                    {this.props.list.map(order => (
                        <OrdersListItem {...order} key={order.account} />
                    ))}
                </div>
            </div>
        );
    }
}
