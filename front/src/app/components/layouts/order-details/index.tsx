import * as React from 'react';
import { OrderView } from './view';
import {
    EnumOrderStatus,
    EnumProfileStatus,
    IOrder,
    EnumOrderType,
} from 'app/api/types';
import { observer } from 'mobx-react';
import { rootStore } from 'app//stores';
import Benchmark from '../../common/benchmark/index';

const orderDetailsStore = rootStore.orderDetailsStore;

interface IProps {
    className?: string;
    orderId: string;
    onCompleteBuyingOrder: (order: IOrder) => {};
}

@observer
export class OrderDetails extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
        orderDetailsStore.updateUserInput({ orderId: this.props.orderId });
    }

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

    protected get order() {
        return orderDetailsStore.order || OrderDetails.emptyOrder;
    }

    public handleSubmit = async (password: string) => {
        const orderId = this.props.orderId;

        orderDetailsStore.updateUserInput({ orderId, password });
        await orderDetailsStore.submit();

        if (orderDetailsStore.validationPassword === '') {
            this.props.onCompleteBuyingOrder(this.order);
        }
    };

    public render() {
        return (
            <OrderView
                order={this.order}
                validationPassword={orderDetailsStore.validationPassword}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default OrderDetails;
