import * as React from 'react';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { RootStore } from 'app/stores/';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { Header } from 'app/components/common/header';
import { IdentIcon } from 'app/components/common/ident-icon';
import { navigate } from 'app/router';
import { Button } from 'app/components/common/button';
import { getMessageText } from 'app/api/error-messages';
import Input from 'antd/es/input';
import Icon from 'antd/es/icon';

interface IProps {
    className?: string;
    rootStore: RootStore;
    initialAddress: string;
}

enum Dialogs {
    giveMe = 'giveMe',
    none = '',
}

@inject('rootStore')
@observer
export class Account extends React.Component<IProps, any> {
    public state = {
        visibleDialog: Dialogs.none,
    };

    public componentWillMount() {
        if (this.props.initialAddress) {
            this.props.rootStore.sendStore.setUserInput({ fromAddress: this.props.initialAddress });
        }
    }

    protected handleChangeAccount = (accountAddres: any) => {
        this.props.rootStore.sendStore.setUserInput({ fromAddress: accountAddres });
    }

    protected handleHistoryClick = () => {
        navigate({
            path: '/history',
            query: {
                address: this.props.rootStore.sendStore.fromAddress,
            },
        });
    }

    protected handleSendClick = (event: any) => {
        const currencyAddress = event.target.name;

        navigate({
            path: '/send',
            query: {
                currency: currencyAddress,
            },
        });
    }

    protected handleGiveMeMore = async (event: any) => {
        event.preventDefault();

        await this.props.rootStore.mainStore.giveMeMore(
            event.target.password.value,
            this.props.rootStore.sendStore.fromAddress,
        );

        await this.props.rootStore.mainStore.update();
    }

    public render() {
        const {
            className,
        } = this.props;

        return [
            <Header className="sonm-account__header" key="header">
                Account
            </Header>,
            <div className={cn('sonm-account', className)} key="account">
                <AccountBigSelect
                    className="sonm-account__account-select"
                    returnPrimitive
                    accounts={this.props.rootStore.mainStore.accountList}
                    onChange={this.handleChangeAccount}
                    value={this.props.rootStore.sendStore.fromAddress}
                />

                <button
                    className="sonm-account__go-to-history"
                    onClick={this.handleHistoryClick}
                >
                    View operation history
                </button>

                {this.props.rootStore.sendStore.currentBalanceList.length === 0 ? null :
                    <ul className="sonm-account__tokens" >
                        <Header className="sonm-account__header">
                            Coins and tokens
                        </Header>
                        {this.props.rootStore.sendStore.currentBalanceList.map(
                            ({ symbol, address, name, balance, decimals }) => {
                            return (
                                <li className="sonm-account-token-list__currency" key={address}>
                                    <IdentIcon
                                        address={address}
                                        width={40}
                                        className="sonm-account-token-list__currency-blockies"
                                    />
                                    <div className="sonm-account-token-list__currency-name">{name}</div>
                                    <div className="sonm-account-token-list__currency-balance">
                                        {balance} {symbol}
                                    </div>
                                    <button
                                        name={address}
                                        className="sonm-account-token-list__currency-button"
                                        onClick={this.handleSendClick}
                                    >
                                        Send
                                    </button>
                                </li>
                            );
                        })}
                    </ul>}

                <form onSubmit={this.handleGiveMeMore} className="sonm-account__give-me">
                    <Header className="sonm-account__header">
                        SONM test tokens request
                    </Header>
                    <div className="sonm-account__warning">
                        You need test Ether for token request. Get some here -
                        <a href="https://faucet.rinkeby.io/" target="_blank">https://faucet.rinkeby.io/</a>
                    </div>
                    <div className="sonm-account__give-me-ct">
                        <Input
                            autoComplete="off"
                            name="password"
                            className="sonm-account__give-me-password"
                            prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                            type="password"
                            placeholder="Account password"
                        />
                        <Button type="submit" className="sonm-account__give-me-button" square transparent>
                            {getMessageText('give_me_more')}
                        </Button>
                    </div>
                </form>
            </div>,
        ];
    }
}
