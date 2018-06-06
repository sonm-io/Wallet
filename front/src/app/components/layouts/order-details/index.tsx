import * as React from 'react';
import { OrderView } from './view';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores';

const orderDetailsStore = rootStore.orderDetailsStore;

interface IProps {
    className?: string;
    orderId: string;
    onCompleteBuyingOrder: () => {};
}

@observer
export class OrderDetails extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
        this.fetch(props.orderId);
    }

    public componentDidUpdate() {
        this.fetch(this.props.orderId);
    }

    public fetch(orderId: string) {
        orderDetailsStore.updateUserInput({ orderId });
    }

    public handleSubmit = async (password: string) => {
        orderDetailsStore.updateUserInput({ password });
        await orderDetailsStore.submit();

        if (orderDetailsStore.validationPassword === '') {
            this.props.onCompleteBuyingOrder();
        }
    };

    public render() {
        return (
            <OrderView
                order={orderDetailsStore.order}
                validationPassword={orderDetailsStore.validationPassword}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default OrderDetails;
