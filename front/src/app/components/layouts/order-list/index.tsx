import * as React from 'react';
import { observer } from 'mobx-react';
import { OrderListView } from './view';
import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';

const store = rootStore.ordersListStore;
const filterStore = rootStore.orderFilterStore;

interface IProps {
    doNotResetFilter?: boolean;
    filterByAddress?: string;
    onNavigateToOrder: (orderId: string) => void;
}

@observer
export class OrderList extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
        this.setOrUpdateFilter(props);
    }

    protected setOrUpdateFilter(props: IProps) {
        const filter = {
            sellerAddress: props.filterByAddress || '',
            profileAddress: rootStore.marketStore.marketAccountAddress,
        };
        if (!props.doNotResetFilter) {
            filterStore.setUserInput(filter);
        } else {
            filterStore.updateUserInput(filter);
        }
    }

    public componentWillReceiveProps(next: IProps) {
        filterStore.updateUserInput({
            sellerAddress: next.filterByAddress || '',
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

    protected handleClickRow = (orderId: string) => {
        this.props.onNavigateToOrder(orderId);
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
                orderBy={store.sortBy}
                orderDesc={store.sortDesc}
                pageLimit={store.limit}
                onChangeLimit={this.handleChangeLimit}
                onChangeOrder={this.handleChangeOrder}
                onRefresh={this.handleRefresh}
                dataSource={store.records}
                onClickRow={this.handleClickRow}
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
                filterRedshiftFrom={filterStore.redshiftFrom}
                filterRedshiftTo={filterStore.redshiftTo}
                filterEthFrom={filterStore.ethFrom}
                filterEthTo={filterStore.ethTo}
                filterZCashFrom={filterStore.zcashFrom}
                filterZCashTo={filterStore.zcashTo}
                filterGpuRamSizeFrom={filterStore.gpuRamSizeFrom}
                filterGpuRamSizeTo={filterStore.gpuRamSizeTo}
            />
        );
    }
}

export default OrderList;
