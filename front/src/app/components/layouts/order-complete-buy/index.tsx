import * as React from 'react';
import * as cn from 'classnames';
import { Header } from 'app/components/common/header';

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

    public render() {
        return (
            <div className={cn('order-complete-buy', this.props.className)}>
                <Header className="order-complete-buy__header" key="header">
                    What will we do next?
                </Header>
                <div className="order-complete-buy__buttons">
                    <button
                        className="order-complete-buy__button"
                        onClick={this.props.onClickMarket}
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
