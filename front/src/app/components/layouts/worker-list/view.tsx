import * as React from 'react';
import Table from 'antd/es/table';
import * as cn from 'classnames';
import { ColumnProps } from 'antd/lib/table';
import { IWorker } from 'app/api/types';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { Button } from 'app/components/common/button';
import { Dialog } from 'app/components/common/dialog';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';

class WorkerTable extends Table<IWorker> {}

interface IProps {
    className?: string;
    dataSource: Array<IWorker>;
    marketAccountAddress: string;
    total: number;
    limit: number;
    page: number;
    onChangePage: (page: number) => void;
    onClickConfirm: (slaveId: string) => void;
    onCloseConfirm: () => void;
    onSubmitConfirm: (password: string) => void;
    showConfirm: boolean;
    validationPassword?: string;
}

export class WorkerListView extends React.PureComponent<IProps, any> {
    protected columns: Array<ColumnProps<IWorker>> = [
        {
            className: 'sonm-workers-list-cell__account',
            dataIndex: 'address',
            title: 'Account',
            render: (address: string, record: IWorker) => {
                return (
                    <ProfileBrief
                        profile={{ address: record.slaveId, status: 0 }}
                        showBalances={false}
                    />
                );
            },
        },
        {
            className: 'sonm-workers-list-cell__buttons',
            dataIndex: 'address',
            title: '',
            render: (address: string, record: IWorker) => {
                return !record.confirmed ? (
                    <Button
                        className="sonm-workers-list-cell__button"
                        onClick={() =>
                            this.props.onClickConfirm(record.slaveId)
                        }
                    >
                        Confirm
                    </Button>
                ) : null;
            },
        },
    ];

    public render() {
        const p = this.props;
        const { className, dataSource } = p;

        const pagination = {
            total: p.total,
            defaultPageSize: p.limit,
            current: p.page,
            onChange: p.onChangePage,
        };

        return (
            <div className={cn('sonm-workers', className)}>
                <WorkerTable
                    className="sonm-workers__table"
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey="id"
                    pagination={pagination}
                />
                {p.showConfirm ? (
                    <Dialog
                        onClickCross={this.props.onCloseConfirm}
                        className={`sonm-workers-confirm__dialog`}
                    >
                        <ConfirmationPanel
                            onSubmit={p.onSubmitConfirm}
                            onCancel={p.onCloseConfirm}
                            validationMessage={p.validationPassword}
                        />
                    </Dialog>
                ) : null}
            </div>
        );
    }
}
