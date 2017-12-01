import * as React from 'react';
import { Table } from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import HistoryStore from '../../../stores/history';
import { ISendTransactionResult } from 'app/api';
import { TableColumnConfig } from 'antd/lib/table/Table';
import * as moment from 'moment';

class TxTable extends Table<ISendTransactionResult> {}

interface IProps {
    className?: string;
    historyStore?: HistoryStore;
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

@inject('historyStore')
@observer
export class History extends React.Component<IProps, any> {

    public render() {
        const {
            className,
            historyStore,
        } = this.props;

        const txList = historyStore
            ? historyStore.currentList
            : [];

        return (
            <div className={cn('sonm-history', className)}>
                <TxTable dataSource={txList} columns={columns} pagination={false} rowKey="hash"/>
            </div>
        );
    }
}
