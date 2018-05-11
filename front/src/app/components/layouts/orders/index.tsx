import * as React from 'react';
import { observer } from 'mobx-react';
import { Orders as OrdersCmp } from 'app/components/common/orders';
import { IOrdersListItemProps } from 'app/components/common/orders-list-item/types';
//import { data, getSorted } from './mock-data';
import { rootStore } from 'app/stores';
import { observable, action, toJS } from 'mobx';
import { IOrder, EnumProfileStatus } from 'app/api/types';

const store = rootStore.ordersListStore;

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
        store.update();
    }

    protected handleChangeLimit = (limit: number) => {
        store.updateUserInput({ limit });
    };

    protected handleChangeOrder = (orderKey: string, isDesc: boolean) => {};

    protected handleRefresh = () => {
        store.update();
    };

    public render() {
        const dataSource = toJS(store.records).map(map);

        let header = {
            orderBy: 'id',
            orderKeys: [
                'CPU Count',
                'GPU ETH hashrate',
                'RAM size',
                'Cost',
                'Lease duration',
            ],
            desc: false,
            limit: store.limit,
            limits: [10, 25, 50, 100],
            onChangeLimit: this.handleChangeLimit,
            onChangeOrder: this.handleChangeOrder,
            onRefresh: this.handleRefresh,
        };
        return <OrdersCmp header={header} list={dataSource} />;
    }
}
