import * as React from 'react';
import Table from 'antd/es/table';
import * as cn from 'classnames';
import { ColumnProps } from 'antd/lib/table';
import { IDeal } from 'app/api/types';
import { Balance } from 'app/components/common/balance-view';
import { Benchmark } from 'app/components/common/benchmark';
import { ProfileBrief } from 'app/components/common/profile-brief';
import * as moment from 'moment';
import {
    DateRangeDropdown,
    IDateRangeChangeParams,
} from 'app/components/common/date-range-dropdown';
import Input from 'antd/es/input';
import { Toggler, ITogglerChangeParams } from 'app/components/common/toggler';
import DealFilterStore from 'app/stores/deal-filter';

class DealTable extends Table<IDeal> {}

interface IProps {
    className?: string;
    dataSource: Array<IDeal>;
    marketAccountAddress: string;
    handleChangeTime: (params: IDateRangeChangeParams) => void;
    handleChangeQuery: (event: any) => void;
    handleChangeActive: (params: ITogglerChangeParams) => void;
    filterStore: DealFilterStore;
    queryValue: string;
}

export class DealListView extends React.PureComponent<IProps, any> {
    protected columns: Array<ColumnProps<IDeal>> = [
        {
            className: 'sonm-deals-list__cell__account',
            dataIndex: 'address',
            title: 'Account',
            render: (address: string, record: IDeal) => {
                return (
                    <ProfileBrief
                        profile={record.supplier}
                        showBalances={false}
                    />
                );
            },
        },
        {
            className: 'sonm-deals-list__cell__date',
            dataIndex: 'startTime',
            title: 'Date',
            render: (time: string, record: IDeal) => {
                const start = moment.unix(record.startTime);
                const end = moment.unix(record.endTime);
                const now = moment().unix();

                return [
                    <div key="1">From: {start.format('D MMM YYYY H:mm')}</div>,
                    record.endTime && now < record.endTime ? (
                        <div key="2">To: {end.format('D MMM YYYY H:mm')}</div>
                    ) : null,
                ];
            },
        },
        {
            className: 'sonm-deals-list__cell__status',
            dataIndex: 'status',
            title: 'Type',
            render: (status: string, record: IDeal) => {
                const type =
                    record.consumer.address.toLowerCase() ===
                    this.props.marketAccountAddress.toLowerCase()
                        ? 'buy'
                        : 'sell';
                const cls = `sonm-deals-list__cell__status--${type}`;

                return (
                    <div className={cn('sonm-deals-list__cell__status', cls)}>
                        {type}
                    </div>
                );
            },
        },
        {
            className: 'sonm-deals-list__cell__stats',
            dataIndex: 'stats',
            title: 'Stats',
            render: (price: string, record: IDeal) => {
                return (
                    <Benchmark
                        data={record.benchmarkMap}
                        keys={['cpuCount', 'ethHashrate', 'ramSize']}
                    />
                );
            },
        },
        {
            className: 'sonm-deals-list__cell__price',
            dataIndex: 'price',
            title: 'Price',
            render: (price: string, record: IDeal) => {
                const now = moment().unix();

                return [
                    <Balance
                        key="1"
                        balance={price}
                        decimalPointOffset={18}
                        decimalDigitAmount={2}
                        symbol="USD/h"
                    />,
                    record.endTime && now < record.endTime ? (
                        <div
                            key="3"
                            className="sonm-deals-list__cell__price--green"
                        >
                            {Math.round((record.endTime - now) / 3600)} hour(s)
                            left
                        </div>
                    ) : null,
                ];
            },
        },
    ];

    public render() {
        const p = this.props;
        const { className, dataSource } = p;

        return (
            <div className={cn('sonm-deals', className)}>
                <DateRangeDropdown
                    className="sonm-deals-filter__date-range"
                    value={[
                        new Date(this.props.filterStore.dateFrom),
                        new Date(this.props.filterStore.dateTo),
                    ]}
                    name="deals-date-range-history"
                    onChange={this.props.handleChangeTime}
                />
                <Input
                    placeholder="Search by address"
                    onChange={this.props.handleChangeQuery}
                    className="sonm-deals-filter__query"
                    value={this.props.queryValue}
                />
                <Toggler
                    className="sonm-deals-filter__active"
                    title="Only active"
                    name="deals-active"
                    value={this.props.filterStore.onlyActive}
                    onChange={this.props.handleChangeActive}
                />
                <DealTable
                    className="sonm-deals__table"
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey="id"
                    pagination={false}
                />
            </div>
        );
    }
}
