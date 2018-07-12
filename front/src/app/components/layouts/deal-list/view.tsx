import * as React from 'react';
import { IDeal } from 'app/api';
import { DealListItem } from './sub/deal-list-item';
import { ListHeader, IListHeader } from 'app/components/common/list-header';
import Icon from 'app/components/common/icon';

interface IDealListViewProps extends IListHeader {
    data: IDeal[];
    marketAccountAddress: string;
    className?: string;
    filterPanel: React.ReactElement<any>;
    onClickRow: (dealId: string) => void;
    onClickBuyResources: () => void;
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
        console.log('render DealListView');
        console.log(p.data);
        return (
            <div className="deal-list">
                {p.filterPanel}
                <div className="deal-list__header-container">
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
                    <a
                        className="deal-list__buy-resources-link"
                        onClick={this.props.onClickBuyResources}
                    >
                        <Icon
                            i="Add"
                            className="deal-list__buy-resources-icon"
                        />
                        Buy resources
                    </a>
                </div>

                {p.data.map(i => (
                    <DealListItem
                        key={i.id}
                        deal={i}
                        buyOrSell={this.getSide(i)}
                        pendingChangeExists={false}
                        onClick={this.props.onClickRow}
                    />
                ))}
            </div>
        );
    }
}
