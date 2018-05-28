import * as React from 'react';
import { observer } from 'mobx-react';
import { OrderListView } from './view';
import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';
import { IBenchmarkMap } from 'app/api/types';

const store = rootStore.ordersListStore;
const filterStore = rootStore.orderFilterStore;

interface IProps {
    filterByAddress?: string;
    onNavigateToQuickBuy: (orderId: string, creatorAddress?: string) => void;
}

@observer
export class OrderList extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
        filterStore.setUserInput({
            profileAddress: this.props.filterByAddress || '',
        });
    }

    public componentWillReceiveProps(next: IProps) {
        filterStore.setUserInput({
            profileAddress: next.filterByAddress || '',
        });
    }

    protected handleChangeLimit = (limit: number) => {
        store.updateUserInput({ limit });
    };

    protected handleChangeOrder = (orderKey: string, isDesc: boolean) => {
        store.updateUserInput({
            sortBy: orderKey,
            sortDesc: isDesc,
        });
    };

    protected handleRefresh = () => {
        store.update();
    };

    protected handleRequireQuickBuy = (orderId: string) => {
        this.props.onNavigateToQuickBuy(orderId, this.props.filterByAddress);
    };

    protected handleApplyFilter = () => {
        filterStore.applyFilter();
    };

    protected handleUpdateFilter = (
        key: keyof IOrderFilter,
        value: IOrderFilter[keyof IOrderFilter],
    ) => {
        const values: Partial<IOrderFilter> = {};
        values[key] = value;
        // console.log(`key=${key}, value=${value}`);
        filterStore.updateUserInput(values);
    };

    public render() {
        return (
            <OrderListView
                schemaOfOrderItem={OrderList.defaultSchemeOfOrderItem}
                orderBy={store.sortBy}
                orderDesc={store.sortDesc}
                pageLimit={store.limit}
                onChangeLimit={this.handleChangeLimit}
                onChangeOrder={this.handleChangeOrder}
                onRefresh={this.handleRefresh}
                dataSource={store.records}
                onRequireQuickBuy={this.handleRequireQuickBuy}
                onApplyFilter={this.handleApplyFilter}
                onUpdateFilter={this.handleUpdateFilter}
                filterOrderOwnerType={filterStore.orderOwnerType}
                filterProfileAddress={filterStore.profileAddress}
                filterSellerAddress={filterStore.sellerAddress}
                filterType={filterStore.type}
                filterOnlyActive={filterStore.onlyActive}
                filterPriceFrom={filterStore.priceFrom}
                filterPriceTo={filterStore.priceTo}
                filterProfessional={filterStore.professional}
                filterRegistered={filterStore.registered}
                filterIdentified={filterStore.identified}
                filterAnonymous={filterStore.anonymous}
                filterCpuCountFrom={filterStore.cpuCountFrom}
                filterCpuCountTo={filterStore.cpuCountTo}
                filterGpuCountFrom={filterStore.gpuCountFrom}
                filterGpuCountTo={filterStore.gpuCountTo}
                filterRamSizeFrom={filterStore.ramSizeFrom}
                filterRamSizeTo={filterStore.ramSizeTo}
                filterStorageSizeFrom={filterStore.storageSizeFrom}
                filterStorageSizeTo={filterStore.storageSizeTo}
            />
        );
    }

    public static defaultSchemeOfOrderItem: Array<
        [keyof IBenchmarkMap, string]
    > = [
        ['cpuCount', 'CPU Count'],
        ['ethHashrate', 'GPU ETH hashrate'],
        ['ramSize', 'RAM size'],
    ];
}

export default OrderList;
