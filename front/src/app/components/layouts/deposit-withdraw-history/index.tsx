import * as React from 'react';
import Table from 'antd/es/table';
import {
    DateRangeDropdown,
    IDateRangeChangeParams,
} from 'app/components/common/date-range-dropdown';
import Select from 'antd/es/select';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores';
import { ISendTransactionResult } from 'app/api';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import * as debounce from 'lodash/fp/debounce';
import { Balance } from 'app/components/common/balance-view';
import { Hash } from 'app/components/common/hash-view';
import { Button } from 'app/components/common/button';

const Option = Select.Option;

const debounce500 = debounce(500);

class TxTable extends Table<ISendTransactionResult> {}

interface IProps {
    className?: string;
    onClickDeposit: () => void;
    onClickWithdraw: () => void;
}

@observer
export class DepositWithdrawHistory extends React.Component<IProps, any> {
    protected columns: Array<ColumnProps<ISendTransactionResult>> = [
        {
            className: 'sonm-tx-list__cell-dw-time sonm-tx-list__cell',
            dataIndex: 'timestamp',
            title: 'Time',
            render: (time, record) => {
                const m = moment(time);
                return <div>{m.format('D MMM YY H:mm:ss')}</div>;
            },
        },
        {
            dataIndex: 'operation',
            title: 'Operation',
            className: 'sonm-tx-list__cell-action sonm-tx-list__cell',
            render: (_, record) => {
                const cls = `sonm-tx-list__cell-action--${record.action}`;

                return (
                    <div>
                        <div className={cn('sonm-tx-list__cell-action', cls)} />
                        <div className="sonm-tx-list__cell-action--label">
                            {record.action}
                        </div>
                    </div>
                );
            },
        },
        {
            dataIndex: 'amount',
            className: 'sonm-tx-list__cell-dw-amount sonm-tx-list__cell',
            title: 'Amount',
            render: (_, record) => {
                const currency = rootStore.mainStore.primaryTokenInfo;

                return (
                    <Balance
                        className="sonm-tx-list__cell-amount-value"
                        key="0"
                        symbol={currency.symbol}
                        balance={record.amount}
                        decimalDigitAmount={10}
                        decimalPointOffset={record.decimalPointOffset}
                    />
                );
            },
        },
        {
            dataIndex: 'fee',
            className: 'sonm-tx-list__cell-dw-amount sonm-tx-list__cell',
            title: 'Fee',
            render: (_, record) => {
                return !record.fee ? (
                    '---'
                ) : (
                    <Balance
                        key="1"
                        className="sonm-tx-list__cell-amount-fee"
                        balance={record.fee}
                        symbol="Ether"
                        decimalDigitAmount={10}
                        decimalPointOffset={18}
                    />
                );
            },
        },
        {
            dataIndex: 'commission',
            className: 'sonm-tx-list__cell-dw-amount sonm-tx-list__cell',
            title: 'Fee',
            render: (_, record) => {
                const currency = rootStore.mainStore.primaryTokenInfo;

                return (
                    <Balance
                        className="sonm-tx-list__cell-amount-amount"
                        key="2"
                        symbol={currency.symbol}
                        balance={'0'}
                        decimalDigitAmount={10}
                        decimalPointOffset={record.decimalPointOffset}
                    />
                );
            },
        },
        {
            dataIndex: 'hash',
            title: 'TxHash',
            className: 'sonm-tx-list__cell-tx-hash sonm-tx-list__cell',
            render: (_, record) => {
                return <Hash hash={record.hash} hasCopyButton />;
            },
        },
        {
            dataIndex: 'status',
            title: 'Status',
            className: 'sonm-tx-list__cell-status sonm-tx-list__cell',
            render: (_, record) => {
                const cls = `sonm-tx-list__cell-status--${record.status}`;

                return (
                    <div className={cn('sonm-tx-list__cell-status', cls)}>
                        {record.status}
                    </div>
                );
            },
        },
    ];

    public state = {
        query: '',
    };

    public componentWillMount() {
        if (!rootStore.dwHistoryStore) {
            return;
        }
    }

    protected handleChangeTime = (params: IDateRangeChangeParams) => {
        rootStore.dwHistoryStore.setFilterTime(
            params.value[0].valueOf(),
            params.value[1].valueOf(),
        );
    };

    protected handlePageChange = (page: number) => {
        rootStore.dwHistoryStore.setPage(page);
    };

    protected handleChangeQuery = (event: any) => {
        const query = event.target.value;

        this.setState({ query });
        this.setQueryDebonced(query);
    };

    protected setQueryDebonced = debounce500((query: string) => {
        rootStore.dwHistoryStore.setQuery(query);
    });

    protected handleSelectOperation = (value: any) => {
        rootStore.dwHistoryStore.setFilterOperation(value as string);
    };

    public render() {
        const { className } = this.props;

        const pagination = {
            total: rootStore.dwHistoryStore.total,
            defaultPageSize: rootStore.dwHistoryStore.perPage,
            current: rootStore.dwHistoryStore.page,
            onChange: this.handlePageChange,
        };

        const operations = [
            {
                name: 'All operations',
                value: '',
            },
            {
                name: 'Deposits',
                value: 'deposit',
            },
            {
                name: 'Withdraws',
                value: 'withdraw',
            },
        ];

        return (
            <div className={cn('sonm-history', className)}>
                <DateRangeDropdown
                    className="sonm-history__date-range"
                    value={[
                        new Date(rootStore.dwHistoryStore.timeStart),
                        new Date(rootStore.dwHistoryStore.timeEnd),
                    ]}
                    name="date-range-history"
                    onChange={this.handleChangeTime}
                />
                <Select
                    onChange={this.handleSelectOperation}
                    value={rootStore.dwHistoryStore.operation}
                    className="sonm-history__select-operation"
                >
                    {operations.map(x => (
                        <Option key={x.value} value={x.value} title={x.name}>
                            {x.name}
                        </Option>
                    ))}
                </Select>

                <Button
                    onClick={this.props.onClickDeposit}
                    color="violet"
                    transparent
                    className="sonm-history__deposit-button"
                >
                    DEPOSIT
                </Button>
                <Button
                    onClick={this.props.onClickWithdraw}
                    color="blue"
                    transparent
                    className="sonm-history__withdraw-button"
                >
                    WITHDRAW
                </Button>

                <TxTable
                    className="sonm-history__table sonm-tx-list"
                    dataSource={rootStore.dwHistoryStore.currentList}
                    columns={this.columns}
                    pagination={pagination}
                    rowKey="hash"
                />
            </div>
        );
    }
}
