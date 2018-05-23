import * as React from 'react';
import * as cn from 'classnames';
import { IAccountBrief, IBenchmarkMap } from 'app/api/types';
import { Benchmark } from 'app/components/common/benchmark';
import { PropertyList } from 'app/components/common/property-list';
import * as moment from 'moment';
import { ProfileBrief } from 'app/components/common/profile-brief';

interface IProps {
    className?: string;
    id: string;
    supplier: IAccountBrief;
    consumer: IAccountBrief;
    duration: number;
    price: string;
    status: number;
    blockedBalance: string;
    totalPayout: string;
    startTime: number;
    endTime: number;
    benchmarkMap: IBenchmarkMap;
    marketAccountAddress: string;
}

export class DealView extends React.PureComponent<IProps, never> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('deal-profile', p.className)}>
                <div className="sonm-deal__column">
                    <div className="sonm-deal__header">Consumer</div>
                    <ProfileBrief
                        className="sonm-deal__consumer"
                        profile={p.consumer}
                        showBalances={false}
                    />
                    <div className="sonm-deal__header">Supplier</div>
                    <ProfileBrief
                        className="sonm-deal__supplier"
                        profile={p.supplier}
                        showBalances={false}
                    />
                    <div className="sonm-deal__header">Details</div>
                    <PropertyList
                        dataSource={{
                            id: p.id,
                            startTime: moment
                                .unix(p.startTime)
                                .format('D MMM YYYY | H:mm'),
                            endTime: p.endTime
                                ? moment
                                      .unix(p.endTime)
                                      .format('D MMM YYYY | H:mm')
                                : '----',
                            status:
                                this.props.marketAccountAddress.toLowerCase() ===
                                p.supplier.address
                                    ? 'SELL'
                                    : 'BUY',
                            blockedBalance: p.blockedBalance,
                            timeLeft: 6,
                        }}
                        config={[
                            {
                                name: 'Deal ID',
                                key: 'id',
                            },
                            {
                                name: 'Deal status',
                                key: 'status',
                            },
                            {
                                name: 'Start',
                                key: 'startTime',
                            },
                            {
                                name: 'Finish',
                                key: 'endTime',
                            },
                            {
                                name: 'Type',
                                key: 'type',
                            },
                            {
                                name: 'Executed payment',
                                key: 'blockedBalance',
                            },
                            {
                                name: 'Time left',
                                key: 'timeLeft',
                                render: value => `${value} H`,
                            },
                        ]}
                    />
                </div>
                <div className="sonm-deal__column">
                    <div className="sonm-deal__header">Resource parameters</div>
                    <Benchmark data={p.benchmarkMap} keys={[]} />
                </div>
            </div>
        );
    }
}

export default DealView;
