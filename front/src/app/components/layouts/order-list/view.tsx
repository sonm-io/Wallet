import * as React from 'react';
import { OrdersListItem } from 'app/components/common/orders-list-item';
import { ListHeader } from 'app/components/common/list-header';
import { IOrdersProps } from './types';
import { Button } from 'app/components/common/button';

export class OrderListView extends React.PureComponent<IOrdersProps, any> {
    public render() {
        const p = this.props;

        return (
            <div className="orders">
                <ListHeader
                    className="orders__header"
                    orderBy={p.orderBy}
                    orderKeys={OrderListView.headerProps.orderKeys}
                    orderDesc={p.orderDesc}
                    onRefresh={p.onRefresh}
                    onChangeLimit={p.onChangeLimit}
                    onChangeOrder={p.onChangeOrder}
                    pageLimit={p.pageLimit}
                    pageLimits={OrderListView.headerProps.pageLimits}
                />
                <div className="orders__list">
                    {p.dataSource.map((order, idx) => (
                        <OrdersListItem
                            profileAddress={order.authorID}
                            profileName={order.creatorName}
                            profileStatus={order.creatorStatus}
                            usdPerHour={order.price}
                            duration={order.duration}
                            orderId={order.id}
                            shemeOfCustomField={p.schemeOfOrderItem}
                            order={order}
                            key={order.id}
                        >
                            <Button
                                onClick={this.handleClick}
                                value={order.id}
                                color="violet"
                            >
                                Buy
                            </Button>
                        </OrdersListItem>
                    ))}
                </div>
            </div>
        );
    }

    public handleClick = (event: any) => {
        this.props.onRequireQuickBuy(event.target.value);
    };

    public static readonly headerProps = {
        orderKeys: {
            cpuCount: 'CPU Count',
            gpuCount: 'GPU Count',
            hashrate: 'ETH hashrate',
            ramSize: 'RAM size',
            price: 'Price',
            duration: 'Duration',
        },
        pageLimits: [10, 25, 50, 100],
    };
}
