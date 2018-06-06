import * as React from 'react';
import { OrdersListItem } from 'app/components/common/orders-list-item';
import { ListHeader } from 'app/components/common/list-header';
import { OrderFilterPanel } from 'app/components/layouts/order-list/sub/order-filter-panel';
import { IOrdersProps } from './types';
import { IOrder } from 'app/api/types';

export class OrderListView extends React.PureComponent<IOrdersProps, any> {
    public render() {
        const p = this.props;
        return (
            <div className="order-list">
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
                            order={order}
                            key={order.id}
                            className="order-list__list-item"
                            onClick={this.handleClick}
                        />
                    ))}
                </div>
                <OrderFilterPanel
                    className="order-list__filter-panel"
                    onApply={p.onApplyFilter}
                    onUpdateFilter={p.onUpdateFilter}
                    orderOwnerType={p.filterOrderOwnerType}
                    profileAddress={p.filterProfileAddress}
                    creatorAddress={p.filterSellerAddress}
                    type={p.filterType}
                    onlyActive={p.filterOnlyActive}
                    priceFrom={p.filterPriceFrom}
                    priceTo={p.filterPriceTo}
                    professional={p.filterProfessional}
                    registered={p.filterRegistered}
                    identified={p.filterIdentified}
                    anonymous={p.filterAnonymous}
                    redshiftFrom={p.filterRedshiftFrom}
                    redshiftTo={p.filterRedshiftTo}
                    ethFrom={p.filterEthFrom}
                    ethTo={p.filterEthTo}
                    zcashFrom={p.filterZCashFrom}
                    zcashTo={p.filterZCashTo}
                    cpuCountFrom={p.filterCpuCountFrom}
                    cpuCountTo={p.filterCpuCountTo}
                    gpuCountFrom={p.filterGpuCountFrom}
                    gpuCountTo={p.filterGpuCountTo}
                    ramSizeFrom={p.filterRamSizeFrom}
                    ramSizeTo={p.filterRamSizeTo}
                    gpuRamSizeFrom={p.filterGpuRamSizeFrom}
                    gpuRamSizeTo={p.filterGpuRamSizeTo}
                    storageSizeFrom={p.filterStorageSizeFrom}
                    storageSizeTo={p.filterStorageSizeTo}
                />
            </div>
        );
    }

    public handleClick = (order: IOrder) => {
        this.props.onClickRow(order.id);
    };

    public static readonly headerProps = {
        orderKeys: {
            redshiftGPU: 'Redshift Benchmark',
            ethHashrate: 'ETH hashrate',
            zcashHashrate: 'ZCash hashrate',
            price: 'Price',
            duration: 'Duration',
        },
        pageLimits: [10, 25, 50, 100],
    };
}
