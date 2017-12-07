import * as React from 'react';
import { Menu, Alert } from 'antd';
import { ClickParam } from 'antd/lib/menu/';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { navigate } from 'app/router';
import { MainStore } from '../../../stores/main';
import { Balance } from '../../common/balance-view';

interface IProps {
    className?: string;
    children: any;
    error: string;
    selectedNavMenuItem: string;
    mainStore: MainStore;
}

@inject('mainStore')
@observer
export class App extends React.Component<IProps, any> {

    public handleMenuClick(param: ClickParam) {
        navigate({path: param.key});
    }

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
                            <Menu.Item key="/wallets" className="sonm-nav__menu-item">
                                Wallet
                            </Menu.Item>
                            <Menu.Item key="/send" className="sonm-nav__menu-item">
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
                </div>
                <div className="sonm-app__content">
                    <div className="sonm-app__alert-ct">
                        {
                            lastErrors.length > 0
                                ? lastErrors.map((e, idx) => <Alert
                                    message={e}
                                    type="warning"
                                    className="sonm-app__alert"
                                    key={idx}
                                />)
                                : null
                        }
                    </div>
                    {children}
                </div>
            </div>
        );
    }
}
