import { RootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';
import { IOrder } from 'app/api/types';
import { TEthereumAddress } from '../entities/types';
import moveDecimalPoint from '../utils/move-decimal-point';
import { BN } from 'app/utils/create-big-number';

const str = (x: any) => (x === undefined ? '' : String(x));

const SECS_IN_HOUR = new BN('3600');

export class DataLoader {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    public loadOrder(orderId: string) {
        this.rootStore.orderDetailsStore.setOrderId(orderId);
    }

    public loadOrderListByParams(filter: Partial<IOrderFilter>) {
        this.rootStore.orderFilterStore.setUserInput(filter);
    }

    public loadOrderListByOrder(order: IOrder) {
        this.loadOrderListByParams({
            side: 'Sell',
            priceFrom: moveDecimalPoint(
                new BN(order.usdWeiPerSeconds).mul(SECS_IN_HOUR).toString(),
                -18,
                4,
            ),
            redshiftFrom: str(order.benchmarkMap.redshiftGpu),
            ethFrom: str(order.benchmarkMap.ethHashrate),
            zCashFrom: str(order.benchmarkMap.zcashHashrate),
            cpuCountFrom: str(order.benchmarkMap.cpuCount),
            gpuCountFrom: str(order.benchmarkMap.gpuCount),
            ramSizeFrom: str(order.benchmarkMap.ramSize),
            gpuRamSizeFrom: str(order.benchmarkMap.gpuRamSize),
        });
    }

    public loadWalletHistoryByParams(
        fromAddress: TEthereumAddress,
        currencyAddress: TEthereumAddress,
    ) {
        this.rootStore.walletHistoryFilterStore.updateUserInput({
            fromAddress,
            currencyAddress,
        });
    }

    public loadProfileDetails(address: TEthereumAddress) {
        this.rootStore.profileDetailsStore.setAddress(address);
    }

    public loadDwhHistory() {
        this.rootStore.dwHistoryListStore.update();
    }

    public loadWalletHistory() {
        this.rootStore.dwHistoryListStore.update();
    }

    public loadDeal(dealId: string) {
        this.rootStore.dealDetailsStore.setDealId(dealId);
    }

    public loadDealList() {
        this.rootStore.dealListStore.update();
    }

    public loadProfileList() {
        this.rootStore.profileListStore.update();
    }

    public loadOrderList() {
        this.rootStore.ordersListStore.update();
    }

    public loadFullOrderList() {
        this.rootStore.orderFilterStore.resetFilters();
    }

    public loadWorkerList() {
        this.rootStore.workerListStore.update();
    }

    public loadKycList() {}
}
