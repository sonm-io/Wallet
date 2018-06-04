import * as React from 'react';
import * as cn from 'classnames';
import { Header } from 'app/components/common/header';
import { rootStore } from 'app/stores';
import { IOrder } from 'app/api/types';
import { IOrderFilter } from 'app/stores/order-filter';

const orderDetailsStore = rootStore.orderDetailsStore;
const orderFilterStore = rootStore.orderFilterStore;

export interface IOrderBuySuccessProps {
    className?: string;
    onClickDeals: () => void;
    onClickMarket: () => void;
    onClickOrders: () => void;
}

export class OrderCompleteBuy extends React.Component<
    IOrderBuySuccessProps,
    never
> {
    constructor(props: IOrderBuySuccessProps) {
        super(props);
    }

    protected toStr = (value: any) =>
        value === undefined ? '' : String(value);

    protected getFilterByOrder = (order: IOrder): Partial<IOrderFilter> => {
        return {
            type: 'Sell',
            priceFrom: order.price,
            redshiftFrom: this.toStr(order.benchmarkMap.redshiftGpu),
            ethFrom: this.toStr(order.benchmarkMap.ethHashrate),
            zcashFrom: this.toStr(order.benchmarkMap.zcashHashrate),
            cpuCountFrom: this.toStr(order.benchmarkMap.cpuCount),
            gpuCountFrom: this.toStr(order.benchmarkMap.gpuCount),
            ramSizeFrom: this.toStr(order.benchmarkMap.ramSize),
            storageSizeFrom: this.toStr(order.benchmarkMap.storageSize),
            gpuRamSizeFrom: this.toStr(order.benchmarkMap.gpuRamSize),
        };
    };

    protected handleMarketClick = () => {
        const order = orderDetailsStore.order;
        if (order !== undefined) {
            const filter = this.getFilterByOrder(order || {});
            orderFilterStore.updateUserInput(filter);
        }
        this.props.onClickMarket();
    };

    public render() {
        return (
            <div className={cn('order-complete-buy', this.props.className)}>
                <Header className="order-complete-buy__header" key="header">
                    What will we do next?
                </Header>
                <div className="order-complete-buy__buttons">
                    <button
                        className="order-complete-buy__button"
                        onClick={this.handleMarketClick}
                    >
                        <div className="order-complete-buy__icon-market" />
                        <div className="order-complete-buy__label">
                            View Market
                        </div>
                    </button>
                    <button
                        className="order-complete-buy__button"
                        onClick={this.props.onClickOrders}
                    >
                        <div className="order-complete-buy__icon-orders" />
                        <div className="order-complete-buy__label">
                            View my orders
                        </div>
                    </button>
                    <button
                        className="order-complete-buy__button"
                        onClick={this.props.onClickDeals}
                    >
                        <div className="order-complete-buy__icon-deals" />
                        <div className="order-complete-buy__label">
                            View my deals
                        </div>
                    </button>
                </div>
            </div>
        );
    }
}
