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
import formatSeconds from 'app/utils/format-seconds';
import { EnumOrderType } from '../../../api/types';
import { EnumOrderStatus } from '../../../api';
import { BN } from 'bn.js';
import { InsuficcientFunds } from './sub/insuficcient-funds';

interface IProps {
    className?: string;
    order: IOrder;
    validationPassword: string;
    onSubmit: (password: string) => void;
    onNavigateBack: () => void;
    onNavigateDeposit: () => void;
    marketBalance: string;
}

class OrderPropertyList extends PropertyList<IOrder> {}

export class OrderView extends React.Component<IProps, never> {
    public static orderViewConfig: Array<IPropertyItemConfig<IOrder>> = [
        {
            id: 'id',
            name: 'ID',
        },
        {
            id: 'duration',
            name: 'Duration',
            renderValue: (seconds: number) =>
                seconds ? formatSeconds(seconds) : '--',
        },
        {
            id: 'orderType',
            name: 'Type',
            renderValue: (orderType: number) =>
                orderType === EnumOrderType.bid ? 'Bid' : 'Ask',
        },
        {
            id: 'orderStatus',
            name: 'Status',
            renderValue: (status: number) =>
                status === EnumOrderStatus.active ? 'Active' : 'Not Active',
        },
    ];

    protected get canBuy() {
        const p = this.props;

        const balance = new BN(p.marketBalance);
        const price = new BN(p.order.price);
        let hours = new BN(p.order.duration).div(new BN(3600));
        hours = hours.isZero ? new BN(1) : hours; // if there is no duration for order, then consider 1 hour.
        return balance.gte(price.mul(hours));
    }

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
                    data={p.order}
                    config={OrderView.orderViewConfig}
                />
                {p.order.orderType === EnumOrderType.ask ? (
                    this.canBuy ? (
                        <ConfirmationPanel
                            className="order-view__confirmation"
                            onSubmit={p.onSubmit}
                            validationMessage={p.validationPassword}
                            labelSubmit="Buy"
                            labelHeader="Accept order"
                        />
                    ) : (
                        <InsuficcientFunds
                            onBack={p.onNavigateBack}
                            onDeposit={p.onNavigateDeposit}
                        />
                    )
                ) : null}
                <Benchmark
                    title="Resource parameters"
                    className="order-view__benchmark"
                    data={p.order.benchmarkMap}
                    ids={Benchmark.detailsPanelIds}
                    names={Benchmark.detailsPanelNames}
                />
                <div className="order-view__price">
                    <h4 className="order-view__header">Price</h4>
                    <Balance
                        symbol="USD/h"
                        balance={p.order.price}
                        decimalPointOffset={18}
                        decimalDigitAmount={4}
                        round
                    />
                </div>
            </div>
        );
    }
}

export default OrderView;
