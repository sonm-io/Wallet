import * as React from 'react';
import Table from 'antd/es/table';
import Input from 'antd/es/input';
import * as cn from 'classnames';
import { ColumnProps } from 'antd/lib/table';
import {
    FixedSelect,
    ISelectItem,
    ISelectChangeParams,
} from 'app/components/common/fixed-select';
import { IProfileBrief, EProfileStatus } from 'app/api/types';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';
import { Country } from 'app/components/common/country';
import { Toggler } from 'app/components/common/toggler';
import { ProfileStatus } from 'app/components/common/profile-status';

class ProfileTable extends Table<IProfileBrief> {}

interface IProps {
    className?: string;
    page: number;
    totalPage: number;
    limit: number;
    dataSource: Array<IProfileBrief>;
    filter: string;
    onChangePage: (page: number) => void;
    onChangeFilter: (filter: string) => void;
    onRowClick: (record: IProfileBrief) => void;
}

const defaultFilter = {
    status: {},
    deals: {},
    role: {},
};

export class ProfileListView extends React.Component<IProps, any> {
    protected static columns: Array<ColumnProps<IProfileBrief>> = [
        {
            className: 'sonm-cell-address sonm-profiles__cell',
            dataIndex: 'address',
            title: 'User',
            render: (address: string, record: IProfileBrief) => {
                return (
                    <React.Fragment>
                        {record.logoUrl ? (
                            <img
                                src={record.logoUrl}
                                className="sonm-cell-address__img"
                            />
                        ) : (
                            <IdentIcon
                                sizePx={25}
                                address={record.address}
                                className="sonm-cell-address__img"
                            />
                        )}
                        {record.name ? (
                            <div className="sonm-cell-address__name">
                                {record.name}
                            </div>
                        ) : null}
                        <Hash
                            className="sonm-cell-address__hex"
                            hash={record.address}
                            hasCopyButton
                        />
                    </React.Fragment>
                );
            },
        },
        {
            className: 'sonm-cell-status sonm-profiles__cell',
            dataIndex: 'status',
            title: 'Status',
            render: (status: EProfileStatus, record: IProfileBrief) => {
                return <ProfileStatus status={status} />;
            },
        },
        {
            className: 'sonm-cell-buy-orders sonm-profiles__cell',
            dataIndex: 'buyOrders',
            title: 'Buy orders',
            render: (buyOrders: number, record: IProfileBrief) => {
                return buyOrders;
            },
        },
        {
            className: 'sonm-cell-sell-orders sonm-profiles__cell',
            dataIndex: 'sellOrders',
            title: 'Sell orders',
            render: (sellOrders: number, record: IProfileBrief) => {
                return sellOrders;
            },
        },
        /*{
            className: 'sonm-cell-deals sonm-profiles__cell',
            dataIndex: 'deals',
            title: 'Deals',
            render: (deals: number, record: IProfileBrief) => {
                return name;
            },
        },*/
        {
            className: 'sonm-cell-country sonm-profile-list__cell',
            dataIndex: 'country',
            title: 'Country',
            render: (contry: string, record: IProfileBrief) => {
                return <Country flagHeightPx={20} abCode2={contry} hasName />;
            },
        },
    ];

    protected static statusOptions: Array<ISelectItem<any>> = [
        {
            value: (defaultFilter.status = { $eq: 0 }),
            stringValue: 'ANONYMOUS',
            className: 'sonm-profiles__status--anon',
        },
        {
            value: { $eq: 1 },
            stringValue: 'REGISTERED',
            className: 'sonm-profiles__status--reg',
        },
        {
            value: { $eq: 2 },
            stringValue: 'IDENTIFIED',
            className: 'sonm-profiles__status--ident',
        },
    ];

    protected static roleOptions: Array<ISelectItem<any>> = [
        {
            value: (defaultFilter.role = { $eq: 1 }),
            stringValue: 'Customer',
        },
        {
            value: { $eq: 2 },
            stringValue: 'Supplier',
        },
    ];

    protected static dealsOptions: Array<ISelectItem<any>> = [
        {
            value: null,
            stringValue: 'Any',
        },
        {
            value: (defaultFilter.deals = { $gt: 0 }),
            stringValue: '> 0',
        },
        {
            value: { $gt: 50 },
            stringValue: '> 50',
        },
        {
            value: { $gt: 1000 },
            stringValue: '> 1000',
        },
    ];

    public static defaultFilter = JSON.stringify(defaultFilter);

    public handlePageChange() {}

    public handleChangeFilter = (params: ISelectChangeParams<any>) => {
        const filter = JSON.parse(this.props.filter) as any;
        const result = { [params.name]: params.value, ...filter };

        this.props.onChangeFilter(JSON.stringify(result));
    };

    public render() {
        const p = this.props;
        const { className, dataSource } = p;
        const filter = JSON.parse(p.filter) as any;

        const pagination = {
            total: p.totalPage,
            defaultPageSize: p.limit,
            current: p.page,
            onChange: p.onChangePage,
        };

        return (
            <div className={cn('sonm-profiles', className)}>
                <div className="sonm-profiles__filters">
                    <FixedSelect
                        className="sonm-profiles__filter-status"
                        name="status"
                        options={ProfileListView.statusOptions}
                        value={filter.status}
                        hasBalloon
                        compareValues={FixedSelect.compareAsJson}
                        onChange={this.handleChangeFilter}
                    />
                    <FixedSelect
                        className="sonm-profiles__filter-role"
                        name="role"
                        options={ProfileListView.roleOptions}
                        value={filter.role}
                        hasBalloon
                        compareValues={FixedSelect.compareAsJson}
                        onChange={this.handleChangeFilter}
                    />
                    <Toggler
                        className="sonm-profiles__filter-pro"
                        title="Professional"
                        value={true}
                        name="professional"
                        titleBefore
                    />
                    <Toggler
                        className="sonm-profiles__filter-cloud"
                        title="Corporate"
                        value={true}
                        name="corporate"
                        titleBefore
                    />
                    <FixedSelect
                        className="sonm-profiles__filter-deals"
                        name="deals"
                        options={ProfileListView.dealsOptions}
                        value={filter.deals}
                        hasBalloon
                        compareValues={FixedSelect.compareAsJson}
                        onChange={this.handleChangeFilter}
                    />
                    <Input />
                </div>
                <ProfileTable
                    className="sonm-profiles__table"
                    dataSource={dataSource}
                    columns={ProfileListView.columns}
                    pagination={pagination}
                    rowKey="address"
                    onRow={(record: IProfileBrief) => {
                        return {
                            onClick: () => this.props.onRowClick(record),
                        };
                    }}
                />
            </div>
        );
    }
}
