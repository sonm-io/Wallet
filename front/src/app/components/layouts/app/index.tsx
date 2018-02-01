import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { RootStore } from 'app/stores';
import { Balance } from 'app/components/common/balance-view';
import { LoadMask } from 'app/components/common/load-mask';
import { AlertList } from './sub/alerts';
import { NavMenu } from './sub/nav-menu/index';

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
        const rootStore = this.props.rootStore;
        const mainStore = rootStore.mainStore;

        const {
            className,
            selectedNavMenuItem,
            children,
        } = this.props;

        const {
            etherBalance,
            primaryTokenBalance,
            accountMap,
        } = mainStore;

        const disabledMenu = rootStore.isOffline || (accountMap.size === 0)
            ? '/send'
            : '';

        return (
            <div className={cn('sonm-app', className)}>
                <LoadMask white visible={rootStore.isPending}>
                    <div className="sonm-app__nav">
                        <div className={`sonm-nav sonm-nav--${mainStore.networkName}`}>
                            <div className="sonm-nav__logo" />
                                <NavMenu
                                    url={selectedNavMenuItem}
                                    items={App.menuConfig}
                                    disabled={disabledMenu}
                                    onChange={this.props.onNavigate}
                                />
                                <div className="sonm-nav__right-group">
                                    <div className="sonm-nav__total">
                                        <Balance
                                            className="sonm-nav__total-item"
                                            fullString={etherBalance}
                                            fontSizePx={18}
                                        />
                                        <Balance
                                            className="sonm-nav__total-item"
                                            fullString={primaryTokenBalance}
                                            fontSizePx={18}
                                        />
                                    </div>
                                    <div className="sonm-nav__network">
                                        <div className="sonm-nav__network-type">
                                            {mainStore.networkName === 'live' ? 'LIVENET' : 'TESTNET'}
                                        </div>
                                        <div className="sonm-nav__network-url">
                                            {mainStore.nodeUrl.replace('https://', '')}
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className="sonm-app__alert-group">
                        {rootStore.isOffline
                            ? <Alert type="error" id="no-connect">No blockchain node connection</Alert>
                            : null
                        }
                        <AlertList className="sonm-app__alert-list" rootStore={rootStore} />
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
