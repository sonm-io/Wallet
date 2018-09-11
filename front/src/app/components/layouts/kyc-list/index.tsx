import * as React from 'react';
import { KycListView } from './view';
import { observer } from 'mobx-react';
import { withRootStore, Layout, IHasRootStore } from '../layout';

interface IProps extends IHasRootStore {
    onNavigateDeposit: () => void;
}

class KycListLayout extends Layout<IProps> {
    protected get store() {
        return this.rootStore.kycList;
    }

    protected handleSubmitPassword = (itemIndex: number, password: string) => {
        this.store.fetchKycLink(itemIndex, password);
    };

    public componentDidMount() {
        this.rootStore.validators.updateValidators();
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
                marketBalance={
                    this.rootStore.myProfiles.currentRequired.marketBalance
                }
                onNavigateDeposit={this.props.onNavigateDeposit}
            />
        );
    }
}

export const KycList = withRootStore(observer(KycListLayout));
