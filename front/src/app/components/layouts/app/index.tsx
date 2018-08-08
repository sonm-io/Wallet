import * as React from 'react';
import { observer } from 'mobx-react';
// import { toJS } from 'mobx';
import { AppView } from './view';
import { IAccount } from './sub/account-select/index';
import { TMenuItem } from './sub/nav-menu-dropdown';
import { INavigator } from 'app/router/types';
import { injectRootStore, Layout, IHasRootStore } from '../layout';

interface IProps extends IHasRootStore {
    className?: string;
    children: any;
    path: string;
    onExit: () => void;
    title?: string;
    disableAccountSelect?: boolean;
    navigator: INavigator;
}

@injectRootStore
@observer
export class App extends Layout<IProps> {
    constructor(props: IProps) {
        super(props);

        const n = props.navigator;
        this.headerMenuConfig = [
            [
                'Wallet',
                undefined,
                [
                    ['Accounts', () => n.to('/wallet/accounts'), undefined],
                    ['History', n.toWalletHistory, undefined],
                    ['Send', () => n.to('/wallet/send'), undefined],
                ],
            ],
            [
                'Market',
                undefined,
                [
                    ['Profiles', () => n.to('/market/profiles'), undefined],
                    ['Orders', n.toOrders, undefined],
                    ['Deals', n.toDeals, undefined],
                    ['Deposit', n.toDeposit, undefined],
                    ['Withdraw', n.toWithdraw, undefined],
                    ['History', n.toDwHistory, undefined],
                    ['Workers', n.toWorkers, undefined],
                ],
            ],
        ];
    }

    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    protected handleChangeMarketAccount = (account: IAccount) => {
        this.rootStore.marketStore.setMarketAccountAddress(account.address);
    };

    protected handleClickMyProfile = () => {
        this.props.navigator.toProfile(
            this.rootStore.marketStore.marketAccountAddress,
        );
    };

    protected headerMenuConfig: Array<TMenuItem> = Array.prototype;

    public render() {
        const rootStore = this.rootStore;
        const p = this.props;
        const t = rootStore.localizator.getMessageText;
        const marketStore = rootStore.marketStore;
        const uiStore = rootStore.uiStore;

        return (
            <AppView
                className={p.className}
                path=""
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
                snmBalance={rootStore.myProfilesStore.primaryTokenBalance}
                etherBalance={rootStore.myProfilesStore.etherBalance}
                title={p.title}
                headerMenu={this.headerMenuConfig}
                disableAccountSelect={p.disableAccountSelect}
                onClickMyProfile={this.handleClickMyProfile}
                isTestNet={rootStore.uiStore.connectionInfo.isTest}
                ethNodeURL={rootStore.uiStore.connectionInfo.ethNodeURL}
                snmNodeURL={rootStore.uiStore.connectionInfo.snmNodeURL}
            >
                {p.children}
            </AppView>
        );
    }
}
