import * as React from 'react';
import Table from 'antd/es/table';
import * as cn from 'classnames';
import { ColumnProps } from 'antd/lib/table';
import { IDeal } from 'app/api/types';
import { PricePerHour } from 'app/components/common/price-per-hour';
import { ProfileBrief } from 'app/components/common/profile-brief';
import {
    DateRangeDropdown,
    IDateRangeChangeParams,
} from 'app/components/common/date-range-dropdown';
import Input from 'antd/es/input';
import { Toggler, ITogglerChangeParams } from 'app/components/common/toggler';
import DealFilterStore from 'app/stores/deal-filter';
import formatSeconds from 'app/utils/format-seconds';
import * as moment from 'moment';

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
    onClickRow: (record: IDeal) => void;
}

export class DealListViewOld extends React.PureComponent<IProps, any> {
    protected columns: Array<ColumnProps<IDeal>> = [
        {
            className: 'sonm-deals-list-cell__account',
            dataIndex: 'address',
            title: 'Account',
            render: (address: string, record: IDeal) => {
                return (
                    <ProfileBrief
                        profile={
                            record.consumer.address.toLowerCase() ===
                            this.props.marketAccountAddress.toLowerCase()
                                ? record.supplier
                                : record.consumer
                        }
                        showBalances={false}
                    />
                );
            },
        },
        {
            className: 'sonm-deals-list-cell__date',
            dataIndex: 'startTime',
            title: 'Date',
            render: (time: string, record: IDeal) => {
                const start = moment.unix(record.startTime);
                const end = moment.unix(record.endTime);

                return [
                    <div key="1">From: {start.format('D MMM YYYY H:mm')}</div>,
                    record.timeLeft ? (
                        <div key="2">To: {end.format('D MMM YYYY H:mm')}</div>
                    ) : null,
                ];
            },
        },
        {
            className: 'sonm-deals-list-cell__status',
            dataIndex: 'status',
            title: 'Type',
            render: (status: string, record: IDeal) => {
                const side =
                    record.consumer.address.toLowerCase() ===
                    this.props.marketAccountAddress.toLowerCase()
                        ? 'Buy'
                        : 'Sell';

                return (
                    <div
                        className={cn(
                            'sonm-deals-list-cell__status',
                            `sonm-deals-list-cell__status--${side}`,
                        )}
                    >
                        {side}
                    </div>
                );
            },
        },
        {
            className: 'sonm-deals-list-cell__stats',
            dataIndex: 'stats',
            title: 'Resource',
            render: (price: string, record: IDeal) => {
                return <div>Benchmarks goes here</div>;
            },
        },
        {
            className: 'sonm-deals-list-cell__price',
            dataIndex: 'price',
            title: 'Price',
            render: (price: string, record: IDeal) => {
                return [
                    <PricePerHour key="1" usdWeiPerSeconds={price} />,
                    record.timeLeft ? (
                        <div
                            key="3"
                            className="sonm-deals-list-cell__price--green"
                        >
                            {formatSeconds(record.timeLeft)} left
                        </div>
                    ) : null,
                ];
            },
        },
    ];

    public getRowProps = (record: IDeal) => ({
        onClick: () => this.props.onClickRow(record),
    });

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
                    disabled
                />
                <Input
                    placeholder="Search by address"
                    onChange={this.props.handleChangeQuery}
                    className="sonm-deals-filter__query"
                    value={this.props.queryValue}
                    disabled
                />
                <Toggler
                    className="sonm-deals-filter__active"
                    title="Only active"
                    name="deals-active"
                    value={this.props.filterStore.onlyActive}
                    onChange={this.props.handleChangeActive}
                    disabled
                />
                <DealTable
                    className="sonm-deals__table"
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey="id"
                    pagination={false}
                    onRow={this.getRowProps}
                />
            </div>
        );
    }
}
