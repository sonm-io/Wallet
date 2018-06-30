import * as React from 'react';
import { DealListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS, autorun } from 'mobx';
import { IDateRangeChangeParams } from 'app/components/common/date-range-dropdown';
import { ITogglerChangeParams } from 'app/components/common/toggler';
import * as debounce from 'lodash/fp/debounce';
import { IDeal } from 'app/api/types';

const debounce500 = debounce(500);

interface IProps {
    className?: string;
    filterByAddress?: string;
    onClickDeal: (dealId: string) => void;
}

const filterStore = rootStore.dealFilterStore;

@observer
export class DealList extends React.Component<IProps, any> {
    public state = {
        query: '',
    };

    constructor(props: IProps) {
        super(props);
    }

    protected syncStores() {
        autorun(() => {
            const fromAddress = rootStore.marketStore.marketAccountAddress;
            filterStore.updateUserInput({ address: fromAddress });
        });
    }

    public componentDidMount() {
        if (rootStore.mainStore.accountAddressList.length === 0) {
            // this.props.onNotAvailable();
        } else {
            rootStore.dealListStore.update();
            rootStore.marketStore.updateMarketStats();
            this.syncStores();
        }
    }

    protected handleChangeTime = (params: IDateRangeChangeParams) => {
        filterStore.updateUserInput({
            dateFrom: params.value[0].valueOf(),
            dateTo: params.value[1].valueOf(),
        });
    };

    protected handleChangeQuery = (event: any) => {
        const query = event.target.value;

        this.setState({ query });
        this.setQueryDebonced(query);
    };

    protected setQueryDebonced = debounce500((query: string) => {
        filterStore.updateUserInput({
            query,
        });
    });

    protected handleChangeActive = (change: ITogglerChangeParams) => {
        filterStore.updateUserInput({
            onlyActive: change.value,
        });
    };

    public handleRowClick = (record: IDeal) => {
        this.props.onClickDeal(record.id);
    };

    public render() {
        const listStore = rootStore.dealListStore;
        const dataSource = toJS(listStore.records);

        return (
            <DealListView
                dataSource={dataSource}
                marketAccountAddress={
                    rootStore.marketStore.marketAccountAddress
                }
                handleChangeQuery={this.handleChangeQuery}
                handleChangeTime={this.handleChangeTime}
                handleChangeActive={this.handleChangeActive}
                filterStore={filterStore}
                queryValue={this.state.query}
                onClickRow={this.handleRowClick}
            />
        );
    }
}
