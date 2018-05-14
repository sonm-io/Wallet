import * as React from 'react';
import { DealListView } from './view';
import { rootStore } from 'app/stores';
import { observer } from 'mobx-react';
import { toJS, autorun } from 'mobx';

interface IProps {
    className?: string;
    filterByAddress?: string;
}

const filterStore = rootStore.dealFilterStore;

@observer
export class DealList extends React.Component<IProps, any> {
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
            //this.props.onNotAvailable();
        } else {
            rootStore.dealListStore.update();
            rootStore.marketStore.updateMarketStats();
            this.syncStores();
        }
    }

    public render() {
        const listStore = rootStore.dealListStore;
        const dataSource = toJS(listStore.records);

        return <DealListView className="" dataSource={dataSource} />;
    }
}
