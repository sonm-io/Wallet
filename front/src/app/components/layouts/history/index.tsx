import * as React from 'react';
import { Table, DatePicker, Select, Input } from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { HistoryStore } from '../../../stores/history';
import { MainStore } from '../../../stores/main';
import { ISendTransactionResult } from 'app/api';
import { TableColumnConfig } from 'antd/lib/table/Table';
import * as moment from 'moment';
import * as debounce from 'lodash/fp/debounce';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Balance } from 'app/components/common/balance-view';
import { Hash } from 'app/components/common/hash-view';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const debounce500 = debounce(500);

class TxTable extends Table<ISendTransactionResult> {}

interface IProps {
    className?: string;
    historyStore?: HistoryStore;
    mainStore?: MainStore;
    initialAddress?: string;
    initialCurrency?: string;
}

@inject('historyStore', 'mainStore')
@observer
export class History extends React.Component<IProps, any> {

    protected columns: Array<TableColumnConfig<ISendTransactionResult>> = [{
        className: 'sonm-tx-list__col-time',
        dataIndex: 'timestamp',
        title: 'Time',
        render: (time, record) => {
            const m = moment(time);

            return [
                <div key="1">{m.format('H:mm:ss')}</div>,
                <div key="2">{m.format('D MMM YY')}</div>,
            ];
        },
    }, {
        dataIndex: 'fromAddress',
        className: 'sonm-tx-list__col-from',
        title: 'From',
        render: (_, record) => {
            const addr = record.fromAddress;
            const account = this.props.mainStore && this.props.mainStore.accountMap.get(addr);
            const name = account
                ? account.name
                : addr;

            return (
                <div className="sonm-tx-list__col-from-ct">
                    <span className="sonm-tx-list__col-from-name">{name}</span>
                    <IdentIcon address={addr} width={20} key="a" className="sonm-tx-list__col-from-icon" />
                    <Hash className="sonm-tx-list__col-from-addr" hash={addr} hasCopyButton />
                </div>
            );
        },
    }, {
        dataIndex: 'toAddress',
        className: 'sonm-tx-list__col-to',
        title: 'To',
        render: (_, record) => {
            const addr = record.toAddress;

            return (
                <div className="sonm-tx-list__col-to-ct">
                    <IdentIcon address={addr} width={20} className="sonm-tx-list__col-to-icon"/>
                    <Hash hash={addr} hasCopyButton className="sonm-tx-list__col-to-hash"/>
                </div>
            );
        },
    }, {
        dataIndex: 'amount',
        className: 'sonm-tx-list__col-amount',
        title: 'Amount / fee',
        render: (_, record) => {
            const addr = record.currencyAddress;
            const currency = this.props.mainStore && this.props.mainStore.currencyMap.get(addr);
            const symbol = currency
                ? currency.symbol
                : '';

            const result = [
                <Balance
                    key="a"
                    className="sonm-tx-list__col-amount-value"
                    symbol={symbol}
                    balance={record.amount}
                />,
            ];

            if (record.fee) {
                result.push(<br key="b"/>);
                result.push(
                    <Balance
                        key="f"
                        className="sonm-tx-list__col-amount-value"
                        balance={record.fee}
                        symbol="Ether"
                        decimals={6}
                    />,
                );
            }

            return result;
        },
    }, {
        dataIndex: 'hash',
        title: 'TxHash',
        className: 'sonm-tx-list__col-hash',
        render: (_, record) => {
            return record.hash.startsWith('0x') ? <Hash hash={record.hash} hasCopyButton /> : record.hash;
        },
    }, {
        dataIndex: 'status',
        title: 'Status',
        className: 'sonm-tx-list__col-status',
        render: (_, record) => {
            const cls = `sonm-tx-list__col-status--${record.status}`;

            return (
                <div className={cn('sonm-tx-list__col-status-ct', cls)}>
                    {record.status}
                </div>
            );
        },
    }];

    public state = {
        query: '',
    };

    public componentWillMount() {
        if (!this.props.historyStore) { return; }

        let updated = false;

        if (this.props.initialAddress) {
            updated = this.props.historyStore.setFilterFrom(this.props.initialAddress);
        }

        if (this.props.initialCurrency) {
            updated = updated || this.props.historyStore.setFilterCurrency(this.props.initialCurrency);
        }

        if (!updated) { this.props.historyStore.update(); }
    }

    protected handleChangeTime = (dates: moment.Moment[]) => {
        this.props.historyStore && this.props.historyStore.setFilterTime(
            dates[0].valueOf(),
            dates[1].valueOf(),
        );
    }

    protected handlePageChange = (page: number) => {
        this.props.historyStore && this.props.historyStore.setPage(page);
    }

    protected handleChangeQuery = (event: any) => {
        const query = event.target.value;

        this.setState({query});
        this.setQueryDebonced(query);
    }

    protected setQueryDebonced = debounce500((query: string) => {
        this.props.historyStore && this.props.historyStore.setQuery(query);
    })

    protected handleSelectCurrency = (value: any) => {
        const address = value as string;

        this.props.historyStore && this.props.historyStore.setFilterCurrency(address);
    }

    public render() {
        if (this.props.mainStore === undefined || this.props.historyStore === undefined) {
            return null;
        }

        const {
            className,
        } = this.props;

        const pagination = {
            total: this.props.historyStore.total,
            defaultPageSize: this.props.historyStore.perPage,
            current: this.props.historyStore.page,
            onChange: this.handlePageChange,
        };

        return (
            <div className={cn('sonm-history', className)}>
                <AccountBigSelect
                    className="sonm-history__select-account"
                    returnPrimitive
                    onChange={this.props.historyStore.setFilterFrom}
                    accounts={this.props.mainStore.accountList}
                    value={this.props.historyStore.fromAddress}
                    hasEmptyOption
                />
                <RangePicker
                    allowClear={false}
                    className="sonm-history__date-range"
                    value={[
                        moment(this.props.historyStore.timeStart),
                        moment(this.props.historyStore.timeEnd),
                    ]}
                    onChange={this.handleChangeTime}
                />
                <Select
                    onChange={this.handleSelectCurrency}
                    value={this.props.historyStore.curencyAddress}
                    className="sonm-history__select-currency"
                >
                    {this.props.mainStore.currentBalanceList.map(
                        x => <Option
                            key={x.address}
                            value={x.address}
                            title={x.symbol}
                        >
                            {x.symbol}
                        </Option>,
                    )}
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
                    className="sonm-history__table"
                    dataSource={this.props.historyStore.currentList}
                    columns={this.columns}
                    pagination={pagination}
                    rowKey="hash"
                />
            </div>
        );
    }
}
