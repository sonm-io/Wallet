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
        this.rootStore.orderDetails.setOrderId(orderId);
    }

    public loadOrderListByParams(filter: Partial<IOrderFilter>) {
        this.rootStore.orderFilter.setUserInput(filter);
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
        this.rootStore.walletHistoryFilter.updateUserInput({
            fromAddress,
            currencyAddress,
        });
    }

    public loadProfileDetails(address: TEthereumAddress) {
        this.rootStore.profileDetails.setAddress(address);
    }

    public loadDwhHistory() {
        this.rootStore.dwHistoryList.update();
    }

    public loadWalletHistory() {
        this.rootStore.dwHistoryList.update();
    }

    public loadDeal(dealId: string) {
        this.rootStore.dealDetails.setDealId(dealId);
    }

    public loadDealList() {
        this.rootStore.dealList.update();
    }

    public loadProfileList() {
        this.rootStore.profileList.update();
    }

    public loadOrderList() {
        this.rootStore.ordersList.update();
    }

    public loadFullOrderList() {
        this.rootStore.orderFilter.resetFilters();
    }

    public loadWorkerList() {
        this.rootStore.workerList.update();
    }

    public loadKycList() {}
}
