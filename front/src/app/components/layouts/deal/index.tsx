import * as React from 'react';
import { DealView } from './view';
import { Api } from 'app/api/';
import { IDeal } from 'app/api/types';
import { rootStore } from 'app/stores';

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
        timeLeft: 1.5,
        benchmarkMap: {
            cpuSysbenchMulti: 1000,
            cpuSysbenchOne: 2000,
            cpuCount: 2,
            gpuCount: 2,
            ethHashrate: 35,
            ramSize: 8192,
            storageSize: 100000,
            downloadNetSpeed: 2.5,
            uploadNetSpeed: 2.5,
            gpuRamSize: 4912,
            zcashHashrate: 12,
            redshiftGpu: 15,
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

        console.log(deal);

        this.setState({
            deal,
        });
    }

    public render() {
        const deal = this.state.deal;
        const marketAccount = rootStore.marketStore.marketAccountAddress.toLowerCase();
        const isOwner =
            deal.supplier.address.toLowerCase() === marketAccount ||
            deal.consumer.address.toLowerCase() === marketAccount;

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
                timeLeft={deal.timeLeft}
                benchmarkMap={deal.benchmarkMap}
                marketAccountAddress={marketAccount}
                showButtons={isOwner}
            />
        );
    }
}

export default Deal;
