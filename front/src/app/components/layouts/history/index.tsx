import * as React from 'react';
import { Table } from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { HistoryStore } from '../../../stores/history';
import { MainStore } from '../../../stores/main';
import { ISendTransactionResult } from 'app/api';
import { TableColumnConfig } from 'antd/lib/table/Table';
import * as moment from 'moment';
import { AccountBigSelect } from 'app/components/common/account-big-select';

class TxTable extends Table<ISendTransactionResult> {}

interface IProps {
    className?: string;
    historyStore?: HistoryStore;
    mainStore?: MainStore;
}

const columns: Array<TableColumnConfig<ISendTransactionResult>> = [{
    dataIndex: 'timestamp',
    title: 'ts',
    className: 'sonm-tx-list__time-col',
    render: (text, record, index) => {
        return moment(text).format('H:mm:ss d MMM YY');
    },
}, {
    dataIndex: 'fromAddress',
    title: 'from',
}, {
}, {
    dataIndex: 'toAddress',
    title: 'to',
}, {
}, {
    dataIndex: 'amount',
    title: 'amount',
    className: 'sonm-tx-list__amount-col',
}, {
}, {
    className: 'sonm-tx-list__currency-col',
    dataIndex: 'currencyAddress',
    title: 'c a',
}, {
}, {
    dataIndex: 'confirmCount',
    title: 'confirm',
}, {
}, {
    dataIndex: 'hash',
    title: 'hash',
}];

interface IFilter {
    account: string;
    currency: string;
    query: string;
}

@inject('historyStore', 'mainStore')
@observer
export class History extends React.Component<IProps, any> {
    public state = {
        account: '',
        currency: '',
        query: '',
    };

    private updateFilter() {
        this.props.historyStore && this.props.historyStore.filter(this.state);
    }

    protected handleChange(update: Partial<IFilter>) {
        this.setState(update, this.updateFilter);
    }

    protected handleChangeAccount = (account: string) => this.handleChange({ account });

    public render() {
        if (this.props.mainStore === undefined || this.props.historyStore === undefined) {
            return null;
        }

        const {
            className,
        } = this.props;

        return (
            <div className={cn('sonm-history', className)}>
                <div className="sonm-history__select-filters">
                    <AccountBigSelect
                        className="sonm-history__select-account"
                        returnPrimitive
                        onChange={this.handleChangeAccount}
                        accounts={this.props.mainStore.accountList}
                        value={this.state.account}
                        hasEmptyOption
                    />

                </div>
                <TxTable
                    dataSource={this.props.historyStore.currentList}
                    columns={columns}
                    pagination={false}
                    rowKey="hash"
                />
            </div>
        );
    }
}
