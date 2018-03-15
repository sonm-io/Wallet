import * as React from 'react';
import { Alert } from 'app/components/common/alert';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores';
import { Balance } from 'app/components/common/balance-view';
import { LoadMask } from 'app/components/common/load-mask';
import { AlertList } from './sub/alerts';
import { NavMenu } from './sub/nav-menu/index';
import { Icon } from 'app/components/common/icon';

interface IProps {
    className?: string;
    children: any;
    error: string;
    selectedNavMenuItem: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
}

@observer
export class App extends React.Component<IProps, any> {
    protected static menuConfig = [
        {
            title: rootStore.localizator.getMessageText('accounts'),
            url: '/accounts',
        },
        { title: rootStore.localizator.getMessageText('send'), url: '/send' },
        {
            title: rootStore.localizator.getMessageText('history'),
            url: '/history',
        },
    ];

    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    public render() {
        const mainStore = rootStore.mainStore;

        const { className, selectedNavMenuItem, children } = this.props;

        const {
            etherBalance,
            primaryTokenBalance,
            primaryTokenInfo,
            accountMap,
        } = mainStore;

        const disabledMenu =
            rootStore.isOffline || accountMap.size === 0 ? '/send' : '';

        return (
            <div className={cn('sonm-app', className)}>
                <LoadMask white visible={rootStore.isPending}>
                    <div className="sonm-app__nav">
                        <div
                            className={`sonm-nav sonm-nav--${
                                mainStore.networkName
                            }`}
                        >
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
                                        balance={etherBalance}
                                        symbol="Ether"
                                        fontSizePx={18}
                                        decimalPointOffset={18}
                                        decimalDigitAmount={2}
                                    />
                                    <Balance
                                        className="sonm-nav__total-item"
                                        balance={primaryTokenBalance}
                                        symbol={primaryTokenInfo.symbol}
                                        fontSizePx={18}
                                        decimalPointOffset={
                                            primaryTokenInfo.decimalPointOffset
                                        }
                                        decimalDigitAmount={2}
                                    />
                                </div>
                                <div className="sonm-nav__network">
                                    <div className="sonm-nav__network-type">
                                        {mainStore.networkName === 'livenet'
                                            ? rootStore.localizator.getMessageText(
                                                  'livenet',
                                              )
                                            : rootStore.localizator.getMessageText(
                                                  'testnet',
                                              )}
                                    </div>
                                    <div className="sonm-nav__network-url">
                                        {mainStore.nodeUrl.replace(
                                            'https://',
                                            '',
                                        )}
                                    </div>
                                </div>
                                <Icon
                                    title="logout"
                                    href="#exit"
                                    tag="a"
                                    i="Exit"
                                    onClick={this.handleExit}
                                    className="sonm-nav__exit-icon"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sonm-app__alert-group">
                        {rootStore.isOffline ? (
                            <Alert type="error" id="no-connect">
                                {rootStore.localizator.getMessageText(
                                    'no_blockchain_conection',
                                )}
                            </Alert>
                        ) : null}
                        <AlertList
                            className="sonm-app__alert-list"
                            rootStore={rootStore}
                        />
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
