import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';
import { IOrder } from 'app/api/types';
import { TEthereumAddress } from '../entities/types';

const str = (x: any) => (x === undefined ? '' : String(x));

export class DataLoader {
    public loadOrder(orderId: string) {
        rootStore.orderDetailsStore.setOrderId(orderId);
    }

    public loadOrderListByParams(filter: Partial<IOrderFilter>) {
        rootStore.orderFilterStore.setUserInput(filter);
    }

    public loadOrderListByOrder(order: IOrder) {
        this.loadOrderListByParams({
            side: 'Sell',
            priceFrom: str(order.usdWeiPerSeconds),
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

    public loadWalletHistoryByParams(
        fromAddress: TEthereumAddress,
        currencyAddress: TEthereumAddress,
    ) {
        rootStore.walletHistoryFilterStore.updateUserInput({
            fromAddress,
            currencyAddress,
        });
    }

    public loadProfileDetails(address: TEthereumAddress) {
        rootStore.profileDetailsStore.setAddress(address);
    }

    public loadDwhHistory() {
        rootStore.dwHistoryListStore.update();
    }

    public loadWalletHistory() {
        rootStore.dwHistoryListStore.update();
    }

    public loadDeal(dealId: string) {
        rootStore.dealDetailsStore.setDealId(dealId);
    }

    public loadDealList() {
        rootStore.dealListStore.update();
    }

    public loadProfileList() {
        rootStore.profileListStore.update();
    }

    public loadOrderList() {
        rootStore.ordersListStore.update();
    }

    public loadFullOrderList() {
        rootStore.orderFilterStore.resetFilters();
    }

    public loadWorkerList() {
        rootStore.workerListStore.update();
    }

    public loadKycList() {}
}
