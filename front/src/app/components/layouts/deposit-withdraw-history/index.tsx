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
import { Icon } from 'app/components/common/icon';

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
            className: 'sonm-dw-tx-list__cell-time sonm-dw-tx-list__cell',
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
            className: 'sonm-dw-tx-list__cell-action sonm-dw-tx-list__cell',
            render: (_, record) => {
                const cls = `sonm-dw-tx-list__cell-action--${record.action}`;

                return (
                    <React.Fragment>
                        <Icon
                            i="ArrowRight"
                            className={cn('sonm-dw-tx-list__cell-action', cls)}
                        />
                        <div className="sonm-dw-tx-list__cell-action--label">
                            {record.action}
                        </div>
                    </React.Fragment>
                );
            },
        },
        {
            dataIndex: 'amount',
            className: 'sonm-dw-tx-list__cell-amount sonm-dw-tx-list__cell',
            title: 'Amount',
            render: (_, record) => {
                const currency = rootStore.mainStore.primaryTokenInfo;

                return (
                    <Balance
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
            className: 'sonm-dw-tx-list__cell-fee sonm-dw-tx-list__cell',
            title: 'Fee',
            render: (_, record) => {
                return !record.fee ? (
                    '---'
                ) : (
                    <Balance
                        key="1"
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
            className: 'sonm-dw-tx-list__cell-commission sonm-dw-tx-list__cell',
            title: 'Commission',
            render: (_, record) => {
                const currency = rootStore.mainStore.primaryTokenInfo;

                return (
                    <Balance
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
            className: 'sonm-dw-tx-list__cell-tx-hash sonm-dw-tx-list__cell',
            render: (_, record) => {
                return <Hash hash={record.hash} hasCopyButton />;
            },
        },
        {
            dataIndex: 'status',
            title: 'Status',
            className: 'sonm-dw-tx-list__cell-status sonm-dw-tx-list__cell',
            render: (_, record) => {
                const cls = `sonm-dw-tx-list__cell-status--${record.status}`;

                return (
                    <div className={cn('sonm-dw-tx-list__cell-status', cls)}>
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
            <div className={cn('sonm-dw-history', className)}>
                <DateRangeDropdown
                    className="sonm-dw-history__date-range"
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
                    className="sonm-dw-history__select-operation"
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
                    className="sonm-dw-history__deposit-button"
                    height={30}
                >
                    DEPOSIT
                </Button>
                <Button
                    onClick={this.props.onClickWithdraw}
                    color="blue"
                    transparent
                    className="sonm-dw-history__withdraw-button"
                    height={30}
                >
                    WITHDRAW
                </Button>

                <TxTable
                    className="sonm-dw-history__table sonm-dw-tx-list"
                    dataSource={rootStore.dwHistoryStore.currentList}
                    columns={this.columns}
                    pagination={pagination}
                    rowKey="hash"
                />
            </div>
        );
    }
}
