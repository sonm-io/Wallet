import * as React from 'react';
import { DealListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { DealFilterPanel, IDealFilter } from './sub/deal-filter-panel';

interface IProps {
    className?: string;
    filterByAddress?: string;
    onClickDeal: (dealId: string) => void;
}

const filterStore = rootStore.dealFilterStore;

const emptyFn = () => {};

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

    public render() {
        console.log('render DealList');
        const listStore = rootStore.dealListStore;
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
                orderBy={''}
                orderDesc={false}
                pageLimit={10}
                onChangeLimit={emptyFn}
                onChangeOrder={emptyFn}
                onRefresh={emptyFn}
            />
        );
    }
}

export { DealListView };
