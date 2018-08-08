import * as React from 'react';
import * as cn from 'classnames';
import { Header } from 'app/components/common/header';
import { IOrder } from 'app/api/types';
import { TEthereumAddress } from 'app/entities/types';
import { injectRootStore, Layout, IHasRootStore } from '../layout';

export interface IOrderBuySuccessProps extends IHasRootStore {
    className?: string;
    onClickDeals: () => void;
    onClickMarket: (order: IOrder) => void;
    onClickOrders: (myAddress: TEthereumAddress) => void;
}

@injectRootStore
export class OrderCompleteBuy extends Layout<IOrderBuySuccessProps> {
    protected handleClickMarket = () => {
        const orderDetailsStore = this.rootStore.orderDetailsStore;
        const order = orderDetailsStore.order;
        if (order !== undefined) {
            this.props.onClickMarket(order);
        }
    };

    protected handleClickOrder = () => {
        const address = this.rootStore.marketStore.marketAccountAddress;

        this.props.onClickOrders(address);
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
                        onClick={this.handleClickMarket}
                    >
                        <div className="order-complete-buy__icon-market" />
                        <div className="order-complete-buy__label">
                            View Market
                        </div>
                    </button>
                    <button
                        className="order-complete-buy__button"
                        onClick={this.handleClickOrder}
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
