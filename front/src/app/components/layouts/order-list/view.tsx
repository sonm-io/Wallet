import * as React from 'react';
import { OrdersListItem } from 'app/components/common/orders-list-item';
import { ListHeader } from 'app/components/common/list-header';
import { OrderFilterPanel } from 'app/components/common/order-filter-panel';
import { IOrdersProps } from './types';
import { Button } from 'app/components/common/button';

export class OrderListView extends React.PureComponent<IOrdersProps, any> {
    public render() {
        const p = this.props;
        return (
            <div className="order-list">
                <div className="order-list__header-and-list">
                    <ListHeader
                        className="order-list__header"
                        orderBy={p.orderBy}
                        orderKeys={OrderListView.headerProps.orderKeys}
                        orderDesc={p.orderDesc}
                        onRefresh={p.onRefresh}
                        onChangeLimit={p.onChangeLimit}
                        onChangeOrder={p.onChangeOrder}
                        pageLimit={p.pageLimit}
                        pageLimits={OrderListView.headerProps.pageLimits}
                    />
                    <div className="order-list__list">
                        {p.dataSource.map((order, idx) => (
                            <OrdersListItem
                                schemaOfCustomField={p.schemaOfOrderItem}
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
                <OrderFilterPanel
                    className="order-list__filter-panel"
                    onApply={p.onApplyFilter}
                    onUpdateFilter={p.onUpdateFilter}
                    // filter
                    orderOwnerType={p.filterOrderOwnerType}
                    profileAddress={p.filterProfileAddress}
                    sellerAddress={p.filterSellerAddress}
                    type={p.filterType}
                    onlyActive={p.filterOnlyActive}
                    priceFrom={p.filterPriceFrom}
                    priceTo={p.filterPriceTo}
                    // owner status
                    professional={p.filterProfessional}
                    registered={p.filterRegistered}
                    identified={p.filterIdentified}
                    anonymous={p.filterAnonymous}
                    // -
                    cpuCountFrom={p.filterCpuCountFrom}
                    cpuCountTo={p.filterCpuCountTo}
                    gpuCountFrom={p.filterGpuCountFrom}
                    gpuCountTo={p.filterGpuCountTo}
                    ramSizeFrom={p.filterRamSizeFrom}
                    ramSizeTo={p.filterRamSizeTo}
                    storageSizeFrom={p.filterStorageSizeFrom}
                    storageSizeTo={p.filterStorageSizeTo}
                />
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
