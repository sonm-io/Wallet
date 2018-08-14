import * as React from 'react';
import { OrderView } from './view';
import { observer } from 'mobx-react';
import { withRootStore, Layout, IHasRootStore } from '../layout';

interface IProps extends IHasRootStore {
    className?: string;
    onCompleteBuyingOrder: () => void;
    onNavigateBack: () => void;
    onNavigateDeposit: () => void;
}

export const OrderDetails = withRootStore(
    observer(
        class extends Layout<IProps> {
            public handleSubmit = async (password: string) => {
                const orderDetailsStore = this.rootStore.orderDetails;

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
                        order={rootStore.orderDetails.order}
                        validationPassword={
                            rootStore.orderDetails.validationPassword
                        }
                        onSubmit={this.handleSubmit}
                        onNavigateBack={p.onNavigateBack}
                        onNavigateDeposit={p.onNavigateDeposit}
                        isBuyingAvailable={
                            rootStore.orderDetails.isBuyingAvailable
                        }
                    />
                );
            }
        },
    ),
);

export default OrderDetails;
