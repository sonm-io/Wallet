import * as React from 'react';
import { observer } from 'mobx-react';
import { OrdersView } from './view';
import { IOrdersListItemProps } from 'app/components/common/orders-list-item/types';
import { rootStore } from 'app/stores';
import { toJS } from 'mobx';
import { IOrder, EnumProfileStatus } from 'app/api/types';

const store = rootStore.ordersListStore;
const filterStore = rootStore.orderFilterStore;

interface IProps {
    filterByAddress?: string;
}

@observer
export class Orders extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);

        filterStore.updateUserInput({ address: props.filterByAddress });
    }

    protected handleChangeLimit = (limit: number) => {
        store.updateUserInput({ limit });
    };

    protected handleChangeOrder = (orderKey: string, isDesc: boolean) => {};

    protected handleRefresh = () => {
        store.update();
    };

    public render() {
        const dataSource = toJS(store.records).map(Orders.processItem);

        return (
            <OrdersView
                {...Orders.headerProps}
                pageLimit={store.limit}
                onChangeLimit={this.handleChangeLimit}
                onChangeOrder={this.handleChangeOrder}
                onRefresh={this.handleRefresh}
                list={dataSource}
            />
        );
    }

    protected static processItem = (source: IOrder): IOrdersListItemProps => {
        return {
            address: '0x0',
            account: source.authorID,
            status: source.orderStatus as EnumProfileStatus,
            customFields: new Map([
                ['CPU Count', `${source.cpuCount}`],
                ['GPU ETH hashrate', `${source.hashrate} Mh/s`],
                ['RAM size', `${source.ramSize} Mb`],
            ]),
            usdPerHour: source.price,
            duration: source.duration,
        };
    };

    protected static headerProps = {
        orderBy: 'id',
        orderDesc: false,
        orderKeys: [
            'CPU Count',
            'GPU ETH hashrate',
            'RAM size',
            'Cost',
            'Lease duration',
        ],
        pageLimits: [10, 25, 50, 100],
    };
}
