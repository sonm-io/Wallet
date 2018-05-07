import * as React from 'react';
import { OrdersListItem } from '../orders-list-item';
import { ListHeader } from '../list-header';
import { IOrdersProps } from './types';

/* ToDo:
    onChangeLimit: state.onChangeLimit,
    onChangeOrder: state.onChangeOrder,
    onRefresh: state.onRefresh,
*/

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
                        <OrdersListItem {...order} />
                    ))}
                </div>
            </div>
        );
    }
}
