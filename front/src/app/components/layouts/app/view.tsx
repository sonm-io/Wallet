import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import * as cn from 'classnames';
import { LoadMask } from 'app/components/common/load-mask';
import { AlertList } from './sub/alerts';
import { AppHeader, IAccount } from './sub/app-header';
import { Header } from 'app/components/common/header';
// import { BreadCrumbs } from 'app/components/common/breadcrumbs';
import { IAlert } from 'app/stores/types';
import { IMarketStats } from 'app/api/types';

interface IProps {
    className?: string;
    children: any;
    path: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
    breadcrumbs: any;

    hasMarketAccountSelect: boolean;
    onChangeMarketAccount: (account: IAccount) => void;

    marketAccountList: IAccount[];
    marketAccount?: IAccount;
    marketStats: IMarketStats;

    networkError: string;
    isPending: boolean;

    alerts: IAlert[];
    onCloseAlert: (alertId: string) => void;

    title?: string;

    snmBalance: string;
    etherBalance: string;
    marketBalance: string;
}

export class AppView extends React.PureComponent<IProps, any> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-app', p.className)}>
                <LoadMask white visible={p.isPending}>
                    <AppHeader
                        onChangeAccount={p.onChangeMarketAccount}
                        accountList={p.marketAccountList}
                        account={p.marketAccount}
                        marketStats={p.marketStats}
                        marketBalance={p.marketBalance}
                        className="sonm-app__header"
                        isTestNet={true}
                        gethNodeUrl="infura.com"
                        sonmNodeUrl="dwh.sonm.com"
                        onNavigate={p.onNavigate}
                        hasMarketAccountSelect={p.hasMarketAccountSelect}
                        snmBalance={p.snmBalance}
                        etherBalance={p.etherBalance}
                        onExit={p.onExit}
                    />
                    <div className="sonm-app__alert-group">
                        {p.networkError ? (
                            <Alert type="error" id="no-connect">
                                {p.networkError}
                            </Alert>
                        ) : null}
                        <AlertList
                            className="sonm-app__alert-list"
                            alerts={p.alerts}
                            onCloseAlert={p.onCloseAlert}
                        />
                    </div>
                    <div className="sonm-app__content">
                        <div className="sonm-app__content-scroll-ct">
                            {p.title ? (
                                <div className="sonm-app__common sonm-app-common-block">
                                    {/*<BreadCrumbs*/}
                                    {/*className="sonm-app__breadcrumbs"*/}
                                    {/*items={p.breadcrumbs}*/}
                                    {/*onNavigate={p.onNavigate}*/}
                                    {/*/>*/}
                                    <Header className="sonm-app-common-block__title">
                                        {p.title}
                                    </Header>
                                </div>
                            ) : null}
                            {p.children}
                        </div>
                    </div>
                </LoadMask>
            </div>
        );
    }
}

export default AppView;
