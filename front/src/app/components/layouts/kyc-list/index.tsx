import * as React from 'react';
import { KycListView } from './view';
import rootStore from 'app/stores';
import { observer } from 'mobx-react';

const store = rootStore.kycListStore;

interface IProps {
    onNavigateDeposit: () => void;
}

@observer
export class KycList extends React.Component<IProps, never> {
    protected handleSubmitPassword(itemIndex: number, password: string) {
        store.fetchKycLink(itemIndex, password);
    }

    public componentDidMount() {
        rootStore.marketStore.updateValidators();
    }

    public render() {
        return (
            <KycListView
                list={store.validators}
                kycLinks={store.links}
                validationMessage={store.validationMessage}
                selectedIndex={store.selectedIndex}
                onSubmitPassword={this.handleSubmitPassword}
                onClickItem={store.select}
                onCloseBottom={store.unselect}
                marketBalance={rootStore.marketStore.marketBalance}
                onNavigateDeposit={this.props.onNavigateDeposit}
            />
        );
    }
}
