import * as React from 'react';
import Table from 'antd/es/table';
import {
    DateRangeDropdown,
    IDateRangeChangeParams,
} from 'app/components/common/date-range-dropdown';
import Select from 'antd/es/select'; // TODO replace with common component
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { ISendTransactionResult } from 'app/api';
import { ColumnProps } from 'antd/lib/table';
import * as moment from 'moment';
import { Balance } from 'app/components/common/balance-view';
import { Hash } from 'app/components/common/hash-view';
import { Button } from 'app/components/common/button';
import { Icon } from 'app/components/common/icon';
import { injectRootStore, Layout, IHasRootStore } from '../layout';
import rootStore from 'app/stores';

const Option = Select.Option;

class TxTable extends Table<ISendTransactionResult> {}

interface IProps extends IHasRootStore {
    className?: string;
    onClickDeposit: () => void;
    onClickWithdraw: () => void;
}

// TODO create pure component view.tsx

@injectRootStore
@observer
export class DepositWithdrawHistory extends Layout<IProps> {
    protected static columns: Array<ColumnProps<ISendTransactionResult>> = [
        {
            className: 'sonm-dw-tx-list__cell-time sonm-dw-tx-list__cell',
            dataIndex: 'timestamp',
            title: 'Time',
            render: (time, record) => {
                return moment(time).format('D MMM YY H:mm:ss');
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
                        <Icon i="ArrowRight" className={cls} />
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
                const currency = rootStore.currencyStore.primaryTokenInfo; // ToDo a

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
                const currency = rootStore.currencyStore.primaryTokenInfo; // ToDo a

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
                return record.hash.indexOf('0x') !== -1 ? (
                    <Hash hash={record.hash} hasCopyButton />
                ) : (
                    record.hash
                );
            },
        },
        {
            dataIndex: 'status',
            title: 'Status',
            className: 'sonm-dw-tx-list__cell-status sonm-dw-tx-list__cell',
            render: (_, record) => {
                const status = String(record.status).toLowerCase();
                const cls = `sonm-dw-tx-list__cell-status--${status}`;

                return (
                    <div className={cn('sonm-dw-tx-list__cell-status', cls)}>
                        {status}
                    </div>
                );
            },
        },
    ];

    protected static operations = [
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

    protected get filterStore() {
        return this.rootStore.dwHistoryFilterStore;
    }

    protected get listStore() {
        return this.rootStore.dwHistoryListStore;
    }

    constructor(props: IProps) {
        super(props);
        this.listStore.update();
    }

    protected handleChangeTime = (params: IDateRangeChangeParams) => {
        this.filterStore.updateUserInput({
            timeStart: params.value[0].valueOf(),
            timeEnd: params.value[1].valueOf(),
        });
    };

    protected handleSelectOperation = (value: any) => {
        this.filterStore.updateUserInput({ operation: value as string });
    };

    public handleChangePage(page: number) {
        this.listStore.updateUserInput({ page });
    }

    public render() {
        const { className } = this.props;
        const listStore = this.listStore;
        const filterStore = this.filterStore;
        const pagination = {
            total: listStore.total,
            defaultPageSize: listStore.limit,
            current: listStore.page,
            onChange: this.handleChangePage,
        };

        return (
            <div className={cn('sonm-dw-history', className)}>
                <DateRangeDropdown
                    className="sonm-dw-history__date-range"
                    value={[
                        new Date(filterStore.timeStart),
                        new Date(filterStore.timeEnd),
                    ]}
                    name="date-range-history"
                    onChange={this.handleChangeTime}
                />
                <Select
                    onChange={this.handleSelectOperation}
                    value={filterStore.operation}
                    className="sonm-dw-history__select-operation"
                >
                    {DepositWithdrawHistory.operations.map(x => (
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
                    dataSource={listStore.records}
                    columns={DepositWithdrawHistory.columns}
                    pagination={pagination}
                    rowKey="timestamp"
                />
            </div>
        );
    }
}
