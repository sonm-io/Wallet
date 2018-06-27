import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';
import { IOrder } from 'app/api/types';
import { TEthereumAddress } from '../entities/types';

const str = (x: any) => (x === undefined ? '' : String(x));

class DataLoader {
    public loadOrder(orderId: string) {
        if (orderId !== '' && rootStore.orderDetailsStore.orderId !== orderId) {
            rootStore.orderDetailsStore.setOrderId(orderId);
        }
    }

    public loadOrderList(filter: Partial<IOrderFilter>) {
        rootStore.orderFilterStore.setUserInput(filter);
    }

    public loadOrderListByOrder(order: IOrder) {
        this.loadOrderList({
            side: 'Sell',
            priceFrom: str(order.price),
            redshiftFrom: str(order.benchmarkMap.redshiftGpu),
            ethFrom: str(order.benchmarkMap.ethHashrate),
            zCashFrom: str(order.benchmarkMap.zcashHashrate),
            cpuCountFrom: str(order.benchmarkMap.cpuCount),
            gpuCountFrom: str(order.benchmarkMap.gpuCount),
            ramSizeFrom: str(order.benchmarkMap.ramSize),
            storageSizeFrom: str(order.benchmarkMap.storageSize),
            gpuRamSizeFrom: str(order.benchmarkMap.gpuRamSize),
        });
    }

    public loadWalletHistory(fromAddress?: TEthereumAddress) {
        rootStore.walletHistoryFilterStore.setUserInput({ fromAddress });
    }

    public resetKycListState() {
        rootStore.kycListStore.reset();
    }

    public loadProfileDetails(address: TEthereumAddress) {
        rootStore.profileDetailsStore.setAddress(address);
    }
}

export const loader = new DataLoader();

export default loader; // TODO think about The prefix for all singletons
