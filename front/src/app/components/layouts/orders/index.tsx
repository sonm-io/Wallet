import * as React from 'react';
import { observer } from 'mobx-react';
import { Orders as OrdersCmp } from 'app/components/common/orders';
import { IOrdersListItemProps } from 'app/components/common/orders-list-item/types';
//import { data, getSorted } from './mock-data';
import { rootStore } from 'app/stores';
import { observable, action, toJS } from 'mobx';
import { IOrder, EnumProfileStatus } from 'app/api/types';

const initialState = observable({
    eventsCounter: {
        onChangeLimit: 0,
        onChangeOrder: 0,
        onRefresh: 0,
    },
    orderBy: 'CPU Count',
    desc: true,
    limit: 25,
    onChangeLimit: action.bound(function(this: any, limit) {
        this.eventsCounter.onChangeLimit++;
        this.limit = limit;
    }),
    onChangeOrder: action.bound(function(
        this: any,
        orderKey: string,
        isDesc: boolean,
    ) {
        this.eventsCounter.onChangeOrder++;
        this.orderBy = orderKey;
        this.desc = isDesc;
    }),
    onRefresh: action.bound(function(this: any) {
        this.eventsCounter.onRefresh++;
    }),
});

const map = (source: IOrder): IOrdersListItemProps => {
    let cpuCount = source.benchmarks.values[2] * 0.001;
    let hashrate = source.benchmarks.values[9];
    let ramSize = source.benchmarks.values[3] * 1024 * 1024;
    return {
        address: '0x0',
        account: source.authorID,
        status: source.orderStatus as EnumProfileStatus,
        customFields: new Map([
            ['CPU Count', `${cpuCount}`],
            ['GPU ETH hashrate', `${hashrate} Mh/s`],
            ['RAM size', `${ramSize} Mb`],
        ]),
        usdPerHour: source.price,
        duration: source.duration,
    };
};

@observer
export class Orders extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = initialState;
        rootStore.ordersListStore.update();
    }

    public render() {
        const listStore = rootStore.ordersListStore;
        const dataSource = toJS(listStore.records).map(map);

        let header = {
            orderBy: this.state.orderBy,
            orderKeys: [
                'CPU Count',
                'GPU ETH hashrate',
                'RAM size',
                'Cost',
                'Lease duration',
            ],
            desc: this.state.desc,
            limit: this.state.limit,
            limits: [10, 25, 50, 100],
            onChangeLimit: this.state.onChangeLimit,
            onChangeOrder: this.state.onChangeOrder,
            onRefresh: this.state.onRefresh,
        };
        return <OrdersCmp header={header} list={dataSource} />;
    }
}
