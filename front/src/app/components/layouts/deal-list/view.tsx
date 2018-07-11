import * as React from 'react';
import { IDeal } from 'app/api';
import { DealListItem } from './sub/deal-list-item';
import { ListHeader, IListHeader } from 'app/components/common/list-header';

interface IDealListViewProps extends IListHeader {
    data: IDeal[];
    marketAccountAddress: string;
    className?: string;
    onClickRow: (orderId: string) => void;
}

export class DealListView extends React.Component<IDealListViewProps, never> {
    public static readonly headerProps = {
        orderKeys: {
            price: 'Price',
            duration: 'Duration',
            status: 'Owner status',
        },
        pageLimits: [10, 25, 50, 100],
    };

    protected getSide = (deal: IDeal) =>
        deal.consumer.address.toLowerCase() ===
        this.props.marketAccountAddress.toLowerCase()
            ? 'buy'
            : 'sell';

    public render() {
        const p = this.props;
        return (
            <div className="deal-list">
                <div className="deal-list__filter-panel">
                    <DateRangeDropdown
                        className="sonm-deals-filter__date-range"
                        value={[
                            new Date(this.props.filterStore.dateFrom),
                            new Date(this.props.filterStore.dateTo),
                        ]}
                        name="deals-date-range-history"
                        onChange={this.props.handleChangeTime}
                        disabled
                    />
                    <Input
                        placeholder="Search by address"
                        onChange={this.props.handleChangeQuery}
                        className="sonm-deals-filter__query"
                        value={this.props.queryValue}
                        disabled
                    />
                    <Toggler
                        className="sonm-deals-filter__active"
                        title="Only active"
                        name="deals-active"
                        value={this.props.filterStore.onlyActive}
                        onChange={this.props.handleChangeActive}
                        disabled
                    />
                </div>
                <ListHeader
                    className="deal-list__header"
                    orderBy={p.orderBy}
                    orderKeys={DealListView.headerProps.orderKeys}
                    orderDesc={p.orderDesc}
                    onRefresh={p.onRefresh}
                    onChangeLimit={p.onChangeLimit}
                    onChangeOrder={p.onChangeOrder}
                    pageLimit={p.pageLimit}
                    pageLimits={DealListView.headerProps.pageLimits}
                />
                {p.data.map(i => (
                    <DealListItem
                        key={i.id}
                        deal={i}
                        buyOrSell={this.getSide(i)}
                        pendingChangeExists={false}
                    />
                ))}
            </div>
        );
    }
}
