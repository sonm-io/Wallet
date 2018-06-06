import * as React from 'react';
import { OrderView } from './view';
import { observer } from 'mobx-react';
import { rootStore } from 'app//stores';

interface IProps {
    className?: string;
    onNavigateToDealList: () => {};
}

@observer
export class OrderDetails extends React.Component<IProps, never> {
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
