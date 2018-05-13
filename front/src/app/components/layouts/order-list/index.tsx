import * as React from 'react';
import { observer } from 'mobx-react';
import { OrderListView } from './view';
import { rootStore } from 'app/stores';

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

    public render() {
        return (
            <OrderListView
                schemeOfOrderItem={OrderList.defaultSchemeOfOrderItem}
                orderBy={store.sortBy}
                orderDesc={store.sortDesc}
                pageLimit={store.limit}
                onChangeLimit={this.handleChangeLimit}
                onChangeOrder={this.handleChangeOrder}
                onRefresh={this.handleRefresh}
                dataSource={store.records}
                onRequireQuickBuy={this.handleRequireQuickBuy}
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
