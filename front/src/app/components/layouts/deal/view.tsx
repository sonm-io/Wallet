import * as React from 'react';
import * as cn from 'classnames';
import { IAccountBrief, IBenchmarkMap } from 'app/api/types';
import { Benchmark } from 'app/components/common/benchmark';
import { PropertyList } from 'app/components/common/property-list';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';
import { ProfileStatus } from 'app/components/common/profile-status';

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
}

export class DealView extends React.PureComponent<IProps, never> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('deal-profile', p.className)}>
                <div className="sonm-deal__column">
                    <div>Consumer</div>
                    <div className="sonm-deals-list__cell__account">
                        <div className="sonm-deals-list__cell__account__logo">
                            <IdentIcon address={p.consumer.address} />
                        </div>
                        <div className="sonm-deals-list__cell__account__main">
                            <span className="sonm-deals-list__cell__account__main-label">
                                Account:
                            </span>
                            <Hash
                                className="sonm-deals-list__cell__account__main-value"
                                hash={p.consumer.address}
                            />

                            <span className="sonm-deals-list__cell__account__main-label">
                                Status:
                            </span>
                            <ProfileStatus
                                className="sonm-deals-list__cell__account__main-value"
                                status={1}
                            />
                        </div>
                    </div>
                    <div>Supplier</div>
                    <div className="sonm-deals-list__cell__account">
                        <div className="sonm-deals-list__cell__account__logo">
                            <IdentIcon address={p.supplier.address} />
                        </div>
                        <div className="sonm-deals-list__cell__account__main">
                            <span className="sonm-deals-list__cell__account__main-label">
                                Account:
                            </span>
                            <Hash
                                className="sonm-deals-list__cell__account__main-value"
                                hash={p.supplier.address}
                            />

                            <span className="sonm-deals-list__cell__account__main-label">
                                Status:
                            </span>
                            <ProfileStatus
                                className="sonm-deals-list__cell__account__main-value"
                                status={1}
                            />
                        </div>
                    </div>
                    <div>Details</div>
                    <PropertyList
                        dataSource={{
                            id: p.id,
                            startDate: p.startTime,
                            endDate: p.endTime,
                            status: p.status,
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
                                key: 'startDate',
                            },
                            {
                                name: 'Finish',
                                key: 'endDate',
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
                    <div>Resource parameters</div>
                    <Benchmark data={p.benchmarkMap} keys={[]} />
                </div>
            </div>
        );
    }
}

export default DealView;
