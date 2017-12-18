import * as React from 'react';
import { Menu, Alert } from 'antd';
import { ClickParam } from 'antd/lib/menu/';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { navigate } from 'app/router';
import { MainStore } from 'app/stores/main';
import { AbstractStore } from 'app/stores/abstract-store';
import { Balance } from 'app/components/common/balance-view';
import { LoadMask } from 'app/components/common/load-mask';

interface IProps {
    className?: string;
    children: any;
    error: string;
    selectedNavMenuItem: string;
    mainStore: MainStore;
}

@inject('mainStore', 'historyStore')
@observer
export class App extends React.Component<IProps, any> {

    public handleMenuClick(param: ClickParam) {
        navigate({ path: param.key }); // TODO move into routing
    }

    protected get stores(): AbstractStore[] {
        const props: any = this.props;

        return Object.keys(props).map(key => props[key]).filter(prop => prop instanceof AbstractStore);
    }

    protected get isPending() { return AbstractStore.getAccumulatedFlag('isPending', ...this.stores); }
    protected get isOffline() { return AbstractStore.getAccumulatedFlag('isOffline', ...this.stores); }

    public render() {
        const {
            className,
            selectedNavMenuItem,
            children,
            mainStore: {
                lastErrors,
                firstTokenBalance,
                secondTokenBalance,
            },
        } = this.props;

        return (
            <div className={cn('sonm-app', className)}>
                <LoadMask white visible={this.isPending}>
                    <div className="sonm-app__nav">
                        <div className="sonm-nav">
                            <div className="sonm-nav__logo" />
                            <Menu
                                onClick={this.handleMenuClick}
                                className="sonm-nav__menu"
                                selectedKeys={[selectedNavMenuItem]}
                                theme="dark"
                                mode="horizontal"
                                style={{
                                    borderColor: 'transparent',
                                }}
                            >
                                <Menu.Item key="/accounts" className="sonm-nav__menu-item">
                                    Accounts
                                </Menu.Item>
                                <Menu.Item key="/send" className="sonm-nav__menu-item" disabled={this.isOffline}>
                                    Send
                                </Menu.Item>
                                <Menu.Item key="/history" className="sonm-nav__menu-item">
                                    History
                                </Menu.Item>
                            </Menu>
                                <Balance
                                    className="sonm-nav__total"
                                    fullString={firstTokenBalance}
                                    fontSizePx={18}
                                />

                                <Balance
                                    className="sonm-nav__total"
                                    fullString={secondTokenBalance}
                                    fontSizePx={18}
                                />
                        </div>
                        <div className="sonm-app__alert-ct">
                            {
                                lastErrors.length > 0
                                    ? lastErrors.map((e, idx) => <Alert
                                        message={e}
                                        type="error"
                                        className="sonm-app__alert"
                                        key={idx}
                                    />)
                                    : null
                            }
                        </div>
                    </div>
                    <div className="sonm-app__content">
                        {children}
                    </div>
                </LoadMask>
            </div>
        );
    }
}
