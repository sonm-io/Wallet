import * as React from 'react';
import { OrderView } from './view';
import { Api } from 'app/api';
import {
    EnumOrderStatus,
    EnumProfileStatus,
    IOrder,
    EnumOrderType,
} from 'app/api/types';
import { observer } from 'mobx-react';
import { rootStore } from 'app//stores';
import Benchmark from '../../common/benchmark/index';

interface IProps {
    className?: string;
    orderId: string;
    onCompleteBuyingOrder: () => {};
}

interface IState {
    order: IOrder;
}

@observer
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
        benchmarkMap: Benchmark.emptyBenchmark,
    };

    public state = {
        order: OrderDetails.emptyOrder,
    };

    public componentDidMount() {
        this.fetchData();
    }

    protected async fetchData() {
        const order = await Api.order.fetchById(this.props.orderId);

        (window as any).__order = order;

        this.setState({
            order,
        });
    }

    public handleSubmit = async (password: string) => {
        const orderId = this.props.orderId;
        const orderDetailsStore = rootStore.orderDetailsStore;

        orderDetailsStore.updateUserInput({ orderId, password });
        await orderDetailsStore.submit();

        if (orderDetailsStore.validationPassword === '') {
            this.props.onCompleteBuyingOrder();
        }
    };

    public render() {
        return (
            <OrderView
                order={this.state.order}
                validationPassword={
                    rootStore.orderDetailsStore.validationPassword
                }
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default OrderDetails;
