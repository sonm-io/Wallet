import * as React from 'react';
import { IDeal } from 'app/api';
import { DealListItem } from './sub/deal-list-item';
import { ListHeader, IOrderable } from 'app/components/common/list-header';
import Icon from 'app/components/common/icon';
import Pagination from 'antd/es/pagination';

interface IHasPaginator {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    onChangePage: (page: number, pageSize?: number) => void;
}

interface IDealListViewProps extends IOrderable, IHasPaginator {
    data: IDeal[];
    marketAccountAddress: string;
    className?: string;
    onClickRow: (dealId: string) => void;
    onClickBuyResources: () => void;
    filterPanel: React.ReactElement<any>;
}

export class DealListView extends React.Component<IDealListViewProps, never> {
    public static readonly headerProps = {
        orderKeys: {
            price: 'Price',
            duration: 'Duration',
            // status: 'Owner status',
        },
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
                {p.filterPanel}
                <div className="deal-list__header-container">
                    <ListHeader
                        className="deal-list__header"
                        orderBy={p.orderBy}
                        orderKeys={DealListView.headerProps.orderKeys}
                        orderDesc={p.orderDesc}
                        onChangeOrder={p.onChangeOrder}
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

                <Pagination
                    className="deal-list__paginator"
                    current={this.props.currentPage}
                    pageSize={this.props.pageSize}
                    total={this.props.totalRecords}
                    onChange={this.props.onChangePage}
                />
            </div>
        );
    }
}
