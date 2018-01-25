import * as React from 'react';
import { default as AntdAlertd } from 'antd/es/alert';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { RootStore } from 'app/stores';
import { Balance } from 'app/components/common/balance-view';
import { LoadMask } from 'app/components/common/load-mask';
import { AlertList } from './sub/alerts';
import { NavMenu } from './sub/nav-menu/index';
import { Alert } from 'app/components/common/alert';

interface IProps {
    className?: string;
    children: any;
    error: string;
    selectedNavMenuItem: string;
    rootStore: RootStore;
    onNavigate: (url: string) => void;
}

@observer
export class App extends React.Component<IProps, any> {
    protected static menuConfig = [
        { title: 'Accounts', url: '/accounts' },
        { title: 'Send', url: '/send' },
        { title: 'History', url: '/history' },
    ];

    public render() {
        const {
            className,
            selectedNavMenuItem,
            children,
        } = this.props;

        const {
            etherBalance,
            primaryTokenBalance,
            accountMap,
        } = this.props.rootStore.mainStore;

        const disabledMenu = this.props.rootStore.isOffline || (accountMap.size === 0)
            ? '/send'
            : '';

        return (
            <div className={cn('sonm-app', className)}>
                <LoadMask white visible={this.props.rootStore.isPending}>
                    <div className="sonm-app__nav">
                        <div className="sonm-nav">
                            <div className="sonm-nav__logo" />
                                <NavMenu
                                    url={selectedNavMenuItem}
                                    items={App.menuConfig}
                                    disabled={disabledMenu}
                                    onChange={this.props.onNavigate}
                                />
                                <div className="sonm-nav__total-group">
                                    <Balance
                                        className="sonm-nav__total"
                                        fullString={etherBalance}
                                        fontSizePx={18}
                                    />
                                    <Balance
                                        className="sonm-nav__total"
                                        fullString={primaryTokenBalance}
                                        fontSizePx={18}
                                    />
                                </div>
                        </div>
                    </div>
                    <div className="sonm-app__alert-group">
                        {this.props.rootStore.isOffline
                            ? <AntdAlertd
                                key="offline"
                                showIcon
                                message="Offline"
                                description="No blockchain node connection"
                                type="warning"
                            /> : null
                        }
                        <AlertList className="sonm-app__alert-list" rootStore={this.props.rootStore}/>
                        <Alert
                            type="warning"
                            id="offline"
                        >
                            Wallet works in testnet! Do not use real keys, Ether or tokens.
                        </Alert>
                    </div>
                    <div className="sonm-app__content">
                        <div className="sonm-app__content-scroll-ct">
                            {children}
                        </div>
                    </div>
                </LoadMask>
            </div>
        );
    }
}
