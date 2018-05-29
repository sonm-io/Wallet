import * as React from 'react';
import { IOrder } from 'app/api/types';
import { ProfileBrief } from 'app/components/common/profile-brief/index';
import { Benchmark } from 'app/components/common/benchmark';
import {
    PropertyList,
    IPropertyItemConfig,
} from 'app/components/common/property-list';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel/index';

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
            key: 'creator',
            name: 'Creator',
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
                    className="order-view__details"
                    dataSource={p.order}
                    config={OrderView.orderViewConfig}
                />
                <ConfirmationPanel
                    className="order-view__confirmation"
                    onSubmit={p.onSubmit}
                    validationMessage={p.validationPassword}
                />
                <Benchmark
                    className="order-view__benchmark"
                    data={p.order.benchmarkMap}
                />
            </div>
        );
    }
}

export default OrderView;
