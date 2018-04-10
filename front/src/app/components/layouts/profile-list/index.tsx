import * as React from 'react';
import Table from 'antd/es/table';
import {
    DateRangeDropdown,
    IDateRangeChangeParams,
} from 'app/components/common/date-range-dropdown';
import Select from 'antd/es/select';
import Input from 'antd/es/input';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores';
import { ISendTransactionResult } from 'app/api';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import * as debounce from 'lodash/fp/debounce';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Balance } from 'app/components/common/balance-view';
import { Hash } from 'app/components/common/hash-view';

const Option = Select.Option;

const debounce500 = debounce(500);

class TxTable extends Table<ISendTransactionResult> {}

interface IProps {
    className?: string;
    initialAddress?: string;
    initialCurrency?: string;
}

@observer
export class History extends React.Component<IProps, any> {
    protected columns: Array<ColumnProps<ISendTransactionResult>> = [
        {
            className: 'sonm-profile-list__cell-time sonm-profile-list__cell',
            dataIndex: 'timestamp',
            title: 'Time',
            render: (time, record) => {
                const m = moment(time);

                return [
                    <div key="1">{m.format('H:mm:ss')}</div>,
                    <div key="2">{m.format('D MMM YY')}</div>,
                ];
            },
        },
    ];

    public componentWillMount() {
        if (!rootStore.historyStore) {
            return;
        }

        let updated = false;

        if (this.props.initialAddress) {
            updated = rootStore.historyStore.setFilterFrom(
                this.props.initialAddress,
            );
        }

        if (this.props.initialCurrency) {
            updated =
                updated ||
                rootStore.historyStore.setFilterCurrency(
                    this.props.initialCurrency,
                );
        }

        if (!updated) {
            rootStore.profileListStore.fetchListData();
        }
    }

    protected handleChangeTime = (params: IDateRangeChangeParams) => {
        rootStore.historyStore.setFilterTime(
            params.value[0].valueOf(),
            params.value[1].valueOf(),
        );
    };

    protected handlePageChange = (page: number) => {
        rootStore.historyStore.setPage(page);
    };

    protected handleChangeQuery = (event: any) => {
        const query = event.target.value;

        this.setState({ query });
        this.setQueryDebonced(query);
    };

    protected setQueryDebonced = debounce500((query: string) => {
        rootStore.historyStore.setQuery(query);
    });

    protected handleSelectCurrency = (value: any) => {
        const address = value as string;

        rootStore.historyStore.setFilterCurrency(address);
    };

    public render() {
        const { className } = this.props;

        const pagination = {
            total: rootStore.historyStore.total,
            defaultPageSize: rootStore.historyStore.perPage,
            current: rootStore.historyStore.page,
            onChange: this.handlePageChange,
        };

        return (
            <div className={cn('sonm-history', className)}>
                <AccountBigSelect
                    className="sonm-history__select-account"
                    returnPrimitive
                    onChange={rootStore.historyStore.setFilterFrom}
                    accounts={rootStore.mainStore.accountList}
                    value={rootStore.historyStore.fromAddress}
                    hasEmptyOption
                />
                <DateRangeDropdown
                    className="sonm-history__date-range"
                    value={[
                        new Date(rootStore.historyStore.timeStart),
                        new Date(rootStore.historyStore.timeEnd),
                    ]}
                    name="date-range-history"
                    onChange={this.handleChangeTime}
                />
                <Select
                    onChange={this.handleSelectCurrency}
                    value={rootStore.historyStore.curencyAddress}
                    className="sonm-history__select-currency"
                >
                    {rootStore.mainStore.fullBalanceList.map(x => (
                        <Option
                            key={x.address}
                            value={x.address}
                            title={x.symbol}
                        >
                            {x.symbol}
                        </Option>
                    ))}
                    <Option value="" title="">
                        All coins
                    </Option>
                </Select>
                <Input
                    placeholder="Search by recipient address / TxHash"
                    onChange={this.handleChangeQuery}
                    className="sonm-history__query"
                    value={this.state.query}
                />

                <TxTable
                    className="sonm-history__table sonm-tx-list"
                    dataSource={rootStore.historyStore.currentList}
                    columns={this.columns}
                    pagination={pagination}
                    rowKey="hash"
                />
            </div>
        );
    }
}
