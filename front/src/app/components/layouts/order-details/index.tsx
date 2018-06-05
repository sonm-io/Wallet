import * as React from 'react';
import { OrderView } from './view';
import { observer } from 'mobx-react';
import { rootStore } from 'app//stores';

interface IProps {
    className?: string;
    orderId: string;
    onNavigateToDealList: () => {};
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
        rootStore.orderDetailsStore.updateUserInput({ orderId });
    }

    public handleSubmit = async (password: string) => {
        const orderDetailsStore = rootStore.orderDetailsStore;

        orderDetailsStore.updateUserInput({ password });
        await orderDetailsStore.submit();

        if (orderDetailsStore.validationPassword === '') {
            this.props.onNavigateToDealList();
        }
    };

    public render() {
        return (
            <OrderView
                order={rootStore.orderDetailsStore.order}
                validationPassword={
                    rootStore.orderDetailsStore.validationPassword
                }
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default OrderDetails;
