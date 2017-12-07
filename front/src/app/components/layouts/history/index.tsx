import * as React from 'react';
import { Table, DatePicker, Spin, Select, Input } from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { HistoryStore } from '../../../stores/history';
import { MainStore } from '../../../stores/main';
import { ISendTransactionResult } from 'app/api';
import { TableColumnConfig } from 'antd/lib/table/Table';
import * as moment from 'moment';
import * as debounce from 'lodash/fp/debounce';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import IdentIcon from '../../common/ident-icon/index';

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
        dataIndex: 'timestamp',
        title: 'Time',
        className: 'sonm-tx-list__time-col',
        render: (text, record, index) => {
            return moment(text).format('H:mm:ss D MMM YY');
        },
    }, {
        dataIndex: 'fromAddress',
        title: 'From',
        render: (a, record, c) => {
            const addr = record.fromAddress;
            const account = this.props.mainStore && this.props.mainStore.accountMap.get(addr);
            const name = account
                ? account.name
                : addr;

            return [
                <IdentIcon address={addr} width={20} key="a"/>,
                name,
            ];
        },
    }, {
    }, {
        dataIndex: 'toAddress',
        title: 'To',
        render: (a, record, c) => {
            const addr = record.toAddress;

            return [
                <IdentIcon address={addr} width={20} key="a"/>,
                addr,
            ];
        },
    }, {
        className: 'sonm-tx-list__amount-col',
        dataIndex: 'amount',
        title: 'Amount',
        render: (a, record, b) => {
            const addr = record.currencyAddress;
            const currency = this.props.mainStore && this.props.mainStore.currencyMap.get(addr);
            const symbol = currency
                ? currency.symbol
                : addr;

            return `${record.amount} ${symbol.toUpperCase()}`;
        },
    }, {
    }, {
        dataIndex: 'fee',
        title: 'Fee',
        render: (a, record, b) => `${record.fee} ETH`,
    }];

    public state = {
        query: '',
    };

    public componentWillMount() {
        if (!this.props.historyStore) { return; }

        if (this.props.initialAddress) { this.props.historyStore.setFilterFrom(this.props.initialAddress); }
        if (this.props.initialCurrency) { this.props.historyStore.setFilterCurrency(this.props.initialCurrency); }

        if (!this.props.initialAddress && !this.props.initialCurrency) { // TODO HACK
            this.props.historyStore.forceUpdate();
        }
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
            <Spin spinning={this.props.historyStore.pending}>
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
                            All currencies
                        </Option>
                    </Select>
                    <Input
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
            </Spin>
        );
    }
}
