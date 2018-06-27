import * as React from 'react';
import { KycListView } from './view';
import rootStore from 'app/stores';
import { observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';

const store = rootStore.kycListStore;

@observer
export class KycList extends React.Component<{}, never> {
    @asyncAction
    protected *handleSubmitPassword(itemIndex: number, password: string) {
        yield store.fetchKycLink(itemIndex, password);
    }

    public render() {
        return (
            <KycListView
                list={store.validators}
                data={store.data}
                selectedIndex={store.selectedIndex}
                onSubmitPassword={this.handleSubmitPassword}
                onClickItem={store.select}
                onCloseBottom={store.unselect}
            />
        );
    }
}
