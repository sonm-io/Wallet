import * as React from 'react';
import { observer } from 'mobx-react';
import { OrderListView } from './view';
import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';

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
        filterStore.updateUserInput({
            address: this.props.filterByAddress || '',
        });
    }

    public componentWillReceiveProps(next: IProps) {
        filterStore.updateUserInput({ address: next.filterByAddress || '' });
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
                filter={{
                    orderOwnerType: filterStore.orderOwnerType,
                    address: filterStore.address,
                    type: filterStore.type,
                    onlyActive: filterStore.onlyActive,
                    priceFrom: filterStore.priceFrom,
                    priceTo: filterStore.priceTo,
                    // owner status:
                    professional: filterStore.professional,
                    registered: filterStore.registered,
                    identified: filterStore.identified,
                    anonymous: filterStore.anonymous,
                    // -
                    cpuCountFrom: filterStore.cpuCountFrom,
                    cpuCountTo: filterStore.cpuCountTo,
                    gpuCountFrom: filterStore.gpuCountFrom,
                    gpuCountTo: filterStore.gpuCountTo,
                    ramSizeFrom: filterStore.ramSizeFrom,
                    ramSizeTo: filterStore.ramSizeTo,
                    storageSizeFrom: filterStore.storageSizeFrom,
                    storageSizeTo: filterStore.storageSizeTo,
                }}
            />
        );
    }

    public static defaultSchemeOfOrderItem = [
        ['CPU Count', 'cpuCount'],
        ['GPU ETH hashrate', 'hashrate'],
        ['RAM size', 'ramSize'],
    ];
}

export default OrderList;
