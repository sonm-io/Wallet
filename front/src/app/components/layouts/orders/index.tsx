import * as React from 'react';
import { observer } from 'mobx-react';
import { Orders as OrdersCmp } from 'app/components/common/orders';
import { data } from './mock-data';
//import { rootStore } from 'app/stores';
import { observable, action } from 'mobx';

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

@observer
export class Orders extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    protected getSorted() {
        let list = data;
        let sortFactor = this.state.desc ? -1 : 1;
        switch (this.state.orderBy) {
            case 'CPU Count':
            case 'GPU ETH hashrate':
            case 'RAM size':
                list = list.sort((a, b) => {
                    let result =
                        (a.customFields.get(this.state.orderBy) as any) >
                        (b.customFields.get(this.state.orderBy) as any);
                    return (result ? 1 : -1) * sortFactor;
                });
                break;
            case 'Cost':
                list = list.sort(
                    (a, b) => (a.usdPerHour - b.usdPerHour) * sortFactor,
                );
                break;
            case 'Lease duration':
                list = list.sort(
                    (a, b) => (a.duration - b.duration) * sortFactor,
                );
                break;
            default:
                throw new Error(
                    'Not implemented sort field: ' + this.state.orderBy,
                );
        }
        return list;
    }

    public render() {
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
        return <OrdersCmp header={header} list={this.getSorted()} />;
    }
}
