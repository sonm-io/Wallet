import * as React from 'react';
import { DealListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { DealFilterPanel } from './sub/deal-filter-panel';
import { IDealFilter } from 'app/stores/deal-filter';

interface IProps {
    className?: string;
    filterByAddress?: string;
    onClickDeal: (dealId: string) => void;
}

const listStore = rootStore.dealListStore;

const filterStore = rootStore.dealFilterStore;

const emptyFn = () => {}; // ToDo a

@observer
export class DealList extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    public componentDidMount() {
        rootStore.dealListStore.startAutoUpdate();
    }

    public componentWillUnmount() {
        rootStore.dealListStore.stopAutoUpdate();
    }

    protected handleUpdateFilter = (
        key: keyof IDealFilter,
        value: string | boolean | [Date, Date],
    ) => {
        filterStore.updateUserInput({ [key]: value });
    };

    protected handleChangePage = (page: number) => {
        listStore.updateUserInput({ page });
    };

    protected handleChangeOrder = (orderKey: string, isDesc: boolean) => {
        listStore.updateUserInput({
            sortBy: orderKey,
            sortDesc: isDesc,
        });
    };

    public render() {
        const filterPanel = (
            <DealFilterPanel
                query={filterStore.query}
                dateRange={filterStore.dateRange}
                onlyActive={filterStore.onlyActive}
                onUpdateFilter={this.handleUpdateFilter}
            />
        );

        return (
            <DealListView
                data={toJS(listStore.records)}
                marketAccountAddress={
                    rootStore.marketStore.marketAccountAddress
                }
                filterPanel={filterPanel}
                onClickRow={this.props.onClickDeal}
                onClickBuyResources={emptyFn}
                orderBy={listStore.sortBy}
                orderDesc={listStore.sortDesc}
                onChangeOrder={this.handleChangeOrder}
                currentPage={listStore.page}
                pageSize={listStore.limit}
                totalRecords={listStore.records.length}
                onChangePage={this.handleChangePage}
            />
        );
    }
}

export { DealListView };
