import * as React from 'react';
import Table from 'antd/es/table';
import Input from 'antd/es/input';
import * as cn from 'classnames';
import { ColumnProps } from 'antd/lib/table';
import { FixedSelect, ISelectItem } from 'app/components/common/fixed-select';
import {
    IProfileBrief,
    EnumProfileStatus,
    EnumProfileRole,
} from 'app/api/types';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Hash } from 'app/components/common/hash-view';
import { Country } from 'app/components/common/country';
import { getMap } from 'app/components/common/country/lands-utils';
import { ProfileStatus } from 'app/components/common/profile-status';
import { MultiSelect } from 'app/components/common/multiselect/index';

class ProfileTable extends Table<IProfileBrief> {}

class DealsFilter extends FixedSelect<number | undefined> {}

interface IProps {
    className?: string;
    page: number;
    total: number;
    limit: number;
    dataSource: Array<IProfileBrief>;
    filter: string;
    onChangePage: (page: number) => void;
    onChangeFilter: (name: string, value: any) => void;
    onClickRow: (record: IProfileBrief) => void;
    filterRole: EnumProfileRole;
    filterStatus: EnumProfileStatus;
    filterQuery: string;
    filterCountry: Array<string>;
    filterMinDeals?: number;
}

const defaultFilter = {
    status: {},
    deals: {},
    role: {},
};

const mapAbCode2ToLand = getMap();
const lands = (Object as any).values(mapAbCode2ToLand);

export class ProfileListView extends React.PureComponent<IProps, any> {
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
            render: (status: EnumProfileStatus, record: IProfileBrief) => {
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
            value: (defaultFilter.status = EnumProfileStatus.anon),
            stringValue: <ProfileStatus status={EnumProfileStatus.anon} />,
        },
        {
            value: EnumProfileStatus.reg,
            stringValue: <ProfileStatus status={EnumProfileStatus.reg} />,
        },
        {
            value: EnumProfileStatus.ident,
            stringValue: <ProfileStatus status={EnumProfileStatus.ident} />,
        },
        {
            value: EnumProfileStatus.pro,
            stringValue: <ProfileStatus status={EnumProfileStatus.pro} />,
        },
    ];

    protected static roleOptions: Array<ISelectItem<any>> = [
        {
            value: (defaultFilter.role = EnumProfileRole.customer),
            stringValue: 'Customer',
        },
        {
            value: EnumProfileRole.supplier,
            stringValue: 'Supplier',
        },
    ];

    protected static dealsOptions: Array<ISelectItem<any>> = [
        {
            value: undefined,
            stringValue: 'Any',
        },
        {
            value: (defaultFilter.deals = 0),
            stringValue: '> 0',
        },
        {
            value: 50,
            stringValue: '> 50',
        },
        {
            value: 1000,
            stringValue: '> 1000',
        },
    ];

    public static defaultFilter = JSON.stringify(defaultFilter);

    public getRowProps = (record: IProfileBrief) => ({
        onClick: () => this.props.onClickRow(record),
    });

    public handleChangeFilter = (params: any) => {
        this.props.onChangeFilter(params.name, params.value);
    };

    public handleChangeCountry = (params: any) => {
        const value = params.value.map((x: any) => x.abCode2);

        this.props.onChangeFilter('country', value);
    };

    public handleChangeQueryFilter = (event: any) => {
        this.props.onChangeFilter('query', event.target.value);
    };

    public render() {
        const p = this.props;
        const { className, dataSource } = p;

        const pagination = {
            total: p.total,
            defaultPageSize: p.limit,
            current: p.page,
            onChange: p.onChangePage,
        };

        console.log(pagination);

        const countryValue = p.filterCountry.map(x => mapAbCode2ToLand[x]);

        return (
            <div className={cn('sonm-profiles', className)}>
                <div className="sonm-profiles__filters">
                    <FixedSelect
                        className="sonm-profiles__filter-status"
                        name="status"
                        options={ProfileListView.statusOptions}
                        value={p.filterStatus}
                        hasBalloon
                        compareValues={FixedSelect.compareAsJson}
                        onChange={this.handleChangeFilter}
                    />
                    <FixedSelect
                        className="sonm-profiles__filter-role"
                        name="role"
                        options={ProfileListView.roleOptions}
                        value={p.filterRole}
                        hasBalloon
                        compareValues={FixedSelect.compareAsJson}
                        onChange={this.handleChangeFilter}
                    />
                    <MultiSelect
                        list={lands}
                        value={countryValue}
                        name="country"
                        onChange={this.handleChangeCountry}
                        hasClearButton={true}
                        label="Country"
                        className="sonm-profiles__filter-country"
                        nameIndex="name"
                        filterPlaceHolder="Country"
                    />
                    <DealsFilter
                        className="sonm-profiles__filter-deals"
                        name="minDeals"
                        options={ProfileListView.dealsOptions}
                        value={p.filterMinDeals}
                        hasBalloon
                        compareValues={FixedSelect.compareAsJson}
                        onChange={this.handleChangeFilter}
                    />
                    <Input
                        name="query"
                        onChange={this.handleChangeQueryFilter}
                    />
                </div>
                <ProfileTable
                    className="sonm-profiles__table"
                    dataSource={dataSource}
                    columns={ProfileListView.columns}
                    pagination={pagination}
                    rowKey="address"
                    onRow={this.getRowProps}
                />
            </div>
        );
    }
}
