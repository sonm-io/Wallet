import * as React from 'react';
import { DealView } from './view';
import { Api } from 'app/api/';
import { IDeal } from 'app/api/types';

interface IProps {
    className?: string;
    id: string;
}

interface IState {
    deal: IDeal;
}

export class Deal extends React.PureComponent<IProps, IState> {
    protected static readonly emptyDeal: IDeal = {
        id: '0',
        supplier: {
            address: '0x1',
            status: 1,
            name: 'name 1',
        },
        consumer: {
            address: '0x2',
            status: 2,
            name: 'name 2',
        },
        masterID: '',
        askID: '',
        bidID: '',
        duration: 100,
        price: '200',
        status: 1,
        blockedBalance: '200',
        totalPayout: '100',
        startTime: 121212,
        endTime: 21121212,
        benchmarkMap: {
            cpuSysbenchMulti: 1000,
            cpuSysbenchOne: 2000,
            cpuCount: 2,
            gpuCount: 2,
            ethHashrate: '35 MH/s',
            ramSize: '8192 Mb',
            storageSize: '100 Gb',
            downloadNetSpeed: '2.5 Mb/s',
            uploadNetSpeed: '2.5 Mb/s',
            gpuRamSize: '4 Gb',
            zcashHashrate: '????',
            redshiftGpu: '?????',
        },
    };

    public state = {
        deal: Deal.emptyDeal,
    };

    public componentDidMount() {
        this.fetchData();
    }

    protected async fetchData() {
        const deal = await Api.deal.fetchById(this.props.id);

        this.setState({
            deal,
        });
    }

    public render() {
        const deal = this.state.deal;

        return (
            <DealView
                id={deal.id}
                supplier={deal.supplier}
                consumer={deal.consumer}
                duration={deal.duration}
                price={deal.price}
                status={deal.status}
                blockedBalance={deal.blockedBalance}
                totalPayout={deal.totalPayout}
                startTime={deal.startTime}
                endTime={deal.endTime}
                benchmarkMap={deal.benchmarkMap}
            />
        );
    }
}

export default Deal;
