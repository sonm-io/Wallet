import * as React from 'react';
import { OrderView } from './view';
import { observer } from 'mobx-react';
import { injectRootStore, Layout, IHasRootStore } from '../layout';

interface IProps extends IHasRootStore {
    className?: string;
    onCompleteBuyingOrder: () => void;
    onNavigateBack: () => void;
    onNavigateDeposit: () => void;
}

@injectRootStore
@observer
export class OrderDetails extends Layout<IProps> {
    public handleSubmit = async (password: string) => {
        const orderDetailsStore = this.rootStore.orderDetailsStore;

        orderDetailsStore.updateUserInput({ password });
        await orderDetailsStore.submit();

        if (orderDetailsStore.validationPassword === '') {
            this.props.onCompleteBuyingOrder();
        }
    };

    public render() {
        const p = this.props;
        const rootStore = this.rootStore;
        return (
            <OrderView
                order={rootStore.orderDetailsStore.order}
                validationPassword={
                    rootStore.orderDetailsStore.validationPassword
                }
                onSubmit={this.handleSubmit}
                onNavigateBack={p.onNavigateBack}
                onNavigateDeposit={p.onNavigateDeposit}
                isBuyingAvailable={
                    rootStore.orderDetailsStore.isBuyingAvailable
                }
            />
        );
    }
}

export default OrderDetails;
