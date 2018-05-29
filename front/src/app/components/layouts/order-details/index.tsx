import * as React from 'react';
import { OrderView } from './view';
import { Api } from 'app/api';
import {
    EnumOrderStatus,
    EnumProfileStatus,
    IOrder,
    EnumOrderType,
} from 'app/api/types';
// import { rootStore } from 'app//stores';

interface IProps {
    className?: string;
    orderId: string;
}

interface IState {
    order: IOrder;
}

export class OrderDetails extends React.Component<IProps, IState> {
    public static emptyOrder: IOrder = {
        id: '0',
        orderType: EnumOrderType.any,
        creator: {
            address: '0x1234567890123456789012345678901234567890',
            status: EnumProfileStatus.anon,
        },
        price: '1',
        duration: 0,
        orderStatus: EnumOrderStatus.active,
        benchmarkMap: {},
    };

    public state = {
        order: OrderDetails.emptyOrder,
    };

    public componentDidMount() {
        this.fetchData();
    }

    protected async fetchData() {
        const order = await Api.order.fetchById(this.props.orderId);

        this.setState({
            order,
        });
    }

    public handleSubmit(password: string) {
        debugger;
    }

    public render() {
        return (
            <OrderView
                order={this.state.order}
                validationPassword="ololo"
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default OrderDetails;
