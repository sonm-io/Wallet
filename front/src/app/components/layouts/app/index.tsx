import * as React from 'react';
import { observer } from 'mobx-react';
// import { toJS } from 'mobx';
import { rootStore } from 'app/stores/index';
import { AppView } from './view';
import { IAccount } from './sub/account-select/index';

interface IProps {
    className?: string;
    children: any;
    path: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
    title?: string;
    disableAccountSelect?: boolean;
}

@observer
export class App extends React.Component<IProps, never> {
    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    protected handleChangeMarketAccount = (account: IAccount) => {
        rootStore.marketStore.setMarketAccountAddress(account.address);
    };

    public render() {
        const p = this.props;
        const t = rootStore.localizator.getMessageText;
        const marketStore = rootStore.marketStore;
        const uiStore = rootStore.uiStore;

        return (
            <AppView
                className={p.className}
                path=""
                onNavigate={p.onNavigate}
                onExit={p.onExit}
                breadcrumbs={[]}
                hasMarketAccountSelect={p.path.startsWith('/market')}
                onChangeMarketAccount={this.handleChangeMarketAccount}
                marketAccountList={marketStore.marketAccountViewList}
                marketAccount={marketStore.marketAccountView}
                marketBalance={marketStore.marketAllBalance}
                marketStats={marketStore.marketStats}
                networkError={
                    rootStore.isOffline ? t('sonmapi_network_error') : ''
                }
                isPending={rootStore.isPending}
                alerts={uiStore.alertList}
                onCloseAlert={uiStore.closeAlert}
                snmBalance={rootStore.mainStore.primaryTokenBalance}
                etherBalance={rootStore.mainStore.etherBalance}
                title={p.title}
                disableAccountSelect={p.disableAccountSelect}
            >
                {p.children}
            </AppView>
        );
    }
}
