import * as React from 'react';
import { KycListView } from './view';
import { observer } from 'mobx-react';
import { injectRootStore, Layout, IHasRootStore } from '../layout';

interface IProps extends IHasRootStore {
    onNavigateDeposit: () => void;
}

@injectRootStore
@observer
export class KycList extends Layout<IProps> {
    protected get store() {
        return this.rootStore.kycListStore;
    }

    protected handleSubmitPassword(itemIndex: number, password: string) {
        this.store.fetchKycLink(itemIndex, password);
    }

    public componentDidMount() {
        this.rootStore.marketStore.updateValidators();
    }

    public render() {
        const store = this.store;
        return (
            <KycListView
                list={store.validators}
                kycLinks={store.links}
                validationMessage={store.validationMessage}
                selectedIndex={store.selectedIndex}
                onSubmitPassword={this.handleSubmitPassword}
                onClickItem={store.select}
                onCloseBottom={store.unselect}
                marketBalance={this.rootStore.marketStore.marketBalance}
                onNavigateDeposit={this.props.onNavigateDeposit}
            />
        );
    }
}
