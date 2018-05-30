import * as React from 'react';
import { IOrder } from 'app/api/types';
import { ProfileBrief } from 'app/components/common/profile-brief/index';
import { Benchmark } from 'app/components/common/benchmark';
import {
    PropertyList,
    IPropertyItemConfig,
} from 'app/components/common/property-list';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel/index';
import { Balance } from 'app/components/common/balance-view/index';

interface IProps {
    className?: string;
    order: IOrder;
    validationPassword: string;
    onSubmit: (password: string) => void;
}

class OrderPropertyList extends PropertyList<IOrder> {}

export class OrderView extends React.Component<IProps, never> {
    public static orderViewConfig: Array<IPropertyItemConfig<keyof IOrder>> = [
        {
            key: 'id',
            name: 'ID',
        },
        {
            key: 'orderType',
            name: 'Side',
        },
        {
            key: 'duration',
            name: 'Duration',
            render: (seconds: string) => `${seconds} sec`,
        },
        {
            key: 'orderStatus',
            name: 'Status',
            // TODO order status component
            render: (status: string) => status,
        },
    ];

    public render() {
        const p = this.props;

        return (
            <div className="order-view">
                <ProfileBrief
                    className="order-view__creator"
                    profile={p.order.creator}
                />
                <OrderPropertyList
                    title="Details"
                    className="order-view__details"
                    dataSource={p.order}
                    config={OrderView.orderViewConfig}
                />
                <ConfirmationPanel
                    className="order-view__confirmation"
                    onSubmit={p.onSubmit}
                    validationMessage={p.validationPassword}
                    labelSubmit="Buy"
                    labelHeader="Accept order"
                />
                <Benchmark
                    title="Resource parameters"
                    className="order-view__benchmark"
                    data={p.order.benchmarkMap}
                />
                <div className="order-view__price">
                    <h4 className="order-view__header">Price</h4>
                    <Balance
                        symbol="USD/h"
                        balance={p.order.price}
                        decimalPointOffset={18}
                        decimalDigitAmount={2}
                    />
                </div>
            </div>
        );
    }
}

export default OrderView;
