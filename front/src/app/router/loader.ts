import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';

class DataLoader {
    public loadOrder(orderId: string) {
        if (orderId !== '' && rootStore.orderDetailsStore.orderId !== orderId) {
            rootStore.orderDetailsStore.setOrderId(orderId);
        }
    }

    public loadOrderList(filter: Partial<IOrderFilter>) {
        rootStore.orderFilterStore.updateUserInput(filter);
    }
}

export const loader = new DataLoader();

export default loader; // TODO think about The prefix for all singletons
