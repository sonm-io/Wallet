import * as React from 'react';
import { IOrdersListItemProps } from './types';
import { PricePerHour } from '../price-per-hour';
import * as cn from 'classnames';
import { ProfileBrief } from 'app/components/common/profile-brief';
import {
    IPropertyItemConfig,
    PropertyList,
    IPropertyListCssClasses,
} from 'app/components/common/property-list';
import { IBenchmarkMap } from '../../../api';
import Icon from '../icon';
import formatSeconds from 'app/utils/format-seconds';

export class OrdersListItem extends React.Component<IOrdersListItemProps, any> {
    protected handleClick = (event: any) => {
        event.preventDefault();

        this.props.onClick(this.props.order);
    };

    protected static dash = (
        <span className="orders-list-item__dash">&mdash;&mdash;</span>
    );

    protected static benchmarksConfig: Array<
        IPropertyItemConfig<keyof IBenchmarkMap | undefined, IBenchmarkMap>
    > = [
        {
            name: 'CPU',
            key: undefined,
            render: (_: any, data: Partial<IBenchmarkMap>) =>
                `${data.cpuSysbenchMulti} (${data.cpuCount} threads)`,
        },
        {
            name: 'Network speed',
            key: undefined,
            render: (_: number, data: Partial<IBenchmarkMap>) =>
                data.uploadNetSpeed === 0 && data.downloadNetSpeed === 0 ? (
                    OrdersListItem.dash
                ) : (
                    <div className="orders-list-item__network-speed">
                        {data.uploadNetSpeed}
                        <Icon i="ArrowUp" /> {data.downloadNetSpeed}
                        <Icon i="ArrowDown" /> Mbps
                    </div>
                ),
        },
        {
            name: 'Redshift benchmark',
            key: 'redshiftGpu',
            render: (value: number) =>
                value === 0 ? OrdersListItem.dash : `${value} K/Ex. time in s`,
        },
        {
            name: 'RAM',
            key: 'ramSize',
            render: (value: number) =>
                value === 0 ? OrdersListItem.dash : `${value} Mb`,
        },
        {
            name: 'GPU #',
            key: 'gpuCount',
            render: (value: number) =>
                value === 0
                    ? OrdersListItem.dash
                    : value === 1
                        ? `${value} unit`
                        : `${value} units`,
        },
        {
            name: 'GPU Ethash',
            key: 'ethHashrate',
            render: (value: number) =>
                value === 0 ? OrdersListItem.dash : `${value} MH/s`,
        },
        {
            name: 'Storage',
            key: 'storageSize',
            render: (value: number) =>
                value === 0 ? OrdersListItem.dash : `${value} Gb`,
        },
        {
            name: 'GPU RAM',
            key: 'gpuRamSize',
            render: (value: number) =>
                value === 0 ? OrdersListItem.dash : `${value} Mb`,
        },
        {
            name: 'GPU Equihash',
            key: 'zcashHashrate',
            render: (value: number) =>
                value === 0 ? OrdersListItem.dash : `${value} sol/s`,
        },
    ];

    protected static benchmarksCssClasses: Partial<IPropertyListCssClasses> = {
        root: 'orders-list-item__benchmarks',
        label: 'orders-list-item__benchmark-label',
        value: 'orders-list-item__benchmark-value',
    };

    public render() {
        return (
            <a
                {...{ 'data-display-id': `orders-list-item` }}
                className={cn('orders-list-item', this.props.className)}
                href={`#order-i-${this.props.order.id}`}
                onClick={this.handleClick}
            >
                {/* Column 1 - Main Info */}
                <ProfileBrief
                    className="orders-list-item__account"
                    profile={this.props.order.creator}
                    showBalances={false}
                    logoSizePx={50}
                />

                {/* Column 2 - Costs */}
                <div className="orders-list-item__cost">
                    <PricePerHour
                        className="orders-list-item__price"
                        usdWeiPerSeconds={this.props.order.usdWeiPerSeconds}
                    />
                    {this.props.order.durationSeconds ? (
                        <div
                            data-display-id="orders-list-item-duration"
                            className="orders-list-item__duration"
                        >
                            {formatSeconds(this.props.order.durationSeconds)}
                        </div>
                    ) : null}
                </div>

                {/* Optional Column 3 - Children */}
                {this.props.children !== undefined ? (
                    <div className="orders-list-item__child">
                        {this.props.children}
                    </div>
                ) : null}

                {/* Benchmarks */}
                <PropertyList
                    className="orders-list-item__benchmarks"
                    cssClasses={OrdersListItem.benchmarksCssClasses}
                    config={OrdersListItem.benchmarksConfig}
                    dataSource={this.props.order.benchmarkMap}
                />
            </a>
        );
    }
}

export default OrdersListItem;
export * from './types';
