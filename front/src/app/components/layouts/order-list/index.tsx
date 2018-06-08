import * as React from 'react';
import { observer } from 'mobx-react';
import { OrderListView } from './view';
import { OrderFilterPanel } from './sub/order-filter-panel';
import { rootStore } from 'app/stores';
import { IOrderFilter } from 'app/stores/order-filter';

const store = rootStore.ordersListStore;
const filterStore = rootStore.orderFilterStore;

interface IProps {
    onNavigateToOrder: (orderId: string) => void;
}

@observer
export class OrderList extends React.Component<IProps, never> {
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

    protected handleUpdateFilter = (
        key: keyof IOrderFilter,
        value: IOrderFilter[keyof IOrderFilter],
    ) => {
        const values: Partial<IOrderFilter> = {};
        values[key] = value;
        filterStore.updateUserInput(values);
    };

    public render() {
        return (
            <OrderListView
                orderBy={store.sortBy}
                orderDesc={store.sortDesc}
                pageLimit={store.limit}
                dataSource={store.records}
                onClickRow={this.handleClickRow}
                onChangeLimit={this.handleChangeLimit}
                onChangeOrder={this.handleChangeOrder}
                onRefresh={this.handleRefresh}
                filterPanel={
                    <OrderFilterPanel
                        onUpdateFilter={this.handleUpdateFilter}
                        creatorAddress={filterStore.userInput.creatorAddress}
                        orderOwnerType={filterStore.userInput.orderOwnerType}
                        side={filterStore.userInput.side}
                        onlyActive={filterStore.userInput.onlyActive}
                        priceFrom={filterStore.userInput.priceFrom}
                        priceTo={filterStore.userInput.priceTo}
                        professional={filterStore.userInput.professional}
                        registered={filterStore.userInput.registered}
                        identified={filterStore.userInput.identified}
                        anonymous={filterStore.userInput.anonymous}
                        cpuCountFrom={filterStore.userInput.cpuCountFrom}
                        cpuCountTo={filterStore.userInput.cpuCountTo}
                        gpuCountFrom={filterStore.userInput.gpuCountFrom}
                        gpuCountTo={filterStore.userInput.gpuCountTo}
                        ramSizeFrom={filterStore.userInput.ramSizeFrom}
                        ramSizeTo={filterStore.userInput.ramSizeTo}
                        storageSizeFrom={filterStore.userInput.storageSizeFrom}
                        storageSizeTo={filterStore.userInput.storageSizeTo}
                        redshiftFrom={filterStore.userInput.redshiftFrom}
                        redshiftTo={filterStore.userInput.redshiftTo}
                        ethFrom={filterStore.userInput.ethFrom}
                        ethTo={filterStore.userInput.ethTo}
                        zCashFrom={filterStore.userInput.zCashFrom}
                        zCashTo={filterStore.userInput.zCashTo}
                        gpuRamSizeFrom={filterStore.userInput.gpuRamSizeFrom}
                        gpuRamSizeTo={filterStore.userInput.gpuRamSizeTo}
                        validation={filterStore.validation}
                        onResetFilter={() => {}}
                    />
                }
            />
        );
    }
}

export default OrderList;
