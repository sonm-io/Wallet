import * as React from 'react';
import Table from 'antd/es/table';
import * as cn from 'classnames';
import { ColumnProps } from 'antd/lib/table';
import { IDeal } from 'app/api/types';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Balance } from 'app/components/common/balance-view';
import * as moment from 'moment';

class DealTable extends Table<IDeal> {}

interface IProps {
    className?: string;
    dataSource: Array<IDeal>;
}
export class DealListView extends React.PureComponent<IProps, any> {
    protected static columns: Array<ColumnProps<IDeal>> = [
        {
            className: 'sonm-cell-address sonm-deals__cell',
            dataIndex: 'address',
            title: 'User',
            render: (address: string, record: IDeal) => {
                return (
                    <React.Fragment>
                        <IdentIcon
                            sizePx={25}
                            address={record.supplierID}
                            className="sonm-cell-address__img"
                        />
                    </React.Fragment>
                );
            },
        },
        {
            className: 'sonm-cell-address sonm-deals__cell',
            dataIndex: 'supplierID',
            title: 'Address',
        },
        {
            className: 'sonm-cell-status sonm-deals__cell',
            dataIndex: 'status',
            title: 'Status',
        },
        {
            className: 'sonm-cell-startTime sonm-deals__cell',
            dataIndex: 'startTime',
            title: 'Date',
            render: (time: string, record: IDeal) => {
                const start = moment.unix(record.startTime);
                const end = moment.unix(record.endTime);
                const now = moment().unix();

                return [
                    <div key="1">From: {start.format('D MMM YYYY H:mm')}</div>,
                    record.endTime ? (
                        <div key="2">To: {end.format('D MMM YYYY H:mm')}</div>
                    ) : null,
                    record.endTime && now < record.endTime ? (
                        <div key="3">
                            {Math.round(100 * (record.endTime - now) / 3600) /
                                100}{' '}
                            hour(s) left
                        </div>
                    ) : null,
                ];
            },
        },
        {
            className: 'sonm-cell-price sonm-deals__cell',
            dataIndex: 'price',
            title: 'Price',
            render: (price: string, record: IDeal) => {
                return (
                    <Balance
                        balance={price}
                        decimalPointOffset={18}
                        decimalDigitAmount={2}
                        symbol="USD/h"
                    />
                );
            },
        },
    ];

    public render() {
        const p = this.props;
        const { className, dataSource } = p;

        return (
            <div className={cn('sonm-deals', className)}>
                <DealTable
                    className="sonm-deals__table"
                    dataSource={dataSource}
                    columns={DealListView.columns}
                    rowKey="id"
                />
            </div>
        );
    }
}
