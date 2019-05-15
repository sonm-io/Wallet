import * as React from 'react';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import { Header } from 'app/components/common/header';
import { IdentIcon } from 'app/components/common/ident-icon';
import { Button } from 'app/components/common/button';
import Input from 'antd/es/input';
import Icon from 'antd/es/icon';
import { Balance } from 'app/components/common/balance-view';
import { TEthereumAddress } from 'app/entities/types';
import { Changelly } from './sub/changelly';
import { withRootStore, IHasRootStore } from '../layout';
import { RootStore } from 'app/stores';

interface IProps extends IHasRootStore {
    className?: string;
    initialAddress: string;
    onClickHistory: (fromAddress?: TEthereumAddress) => void;
    onClickSend: () => void;
}

enum Dialogs {
    giveMe = 'giveMe',
    changelly = 'changelly',
    none = '',
}

enum Currencies {
    eth = 'ETH',
    snm = 'SNM',
    none = '',
}

class AccountLayout extends React.Component<IProps, any> {
    // ToDo make stateless

    protected get rootStore() {
        return this.props.rootStore as RootStore;
    }

    public state = {
        visibleDialog: Dialogs.none,
        currency: Currencies.none,
    };

    public componentWillMount() {
        if (this.props.initialAddress) {
            this.rootStore.send.setUserInput({
                fromAddress: this.props.initialAddress,
            });
        }
    }

    protected handleChangeAccount = (accountAddress: any) => {
        this.rootStore.send.setUserInput({
            fromAddress: accountAddress,
        });
    };

    protected handleClickHistory = () => {
        this.props.onClickHistory(this.rootStore.send.fromAddress);
    };

    protected handleSendClick = (event: any) => {
        const currencyAddress = event.target.name;

        this.rootStore.send.setUserInput({
            currencyAddress,
        });

        this.props.onClickSend();
    };

    protected handleGiveMeMore = async (event: any) => {
        event.preventDefault();

        await this.rootStore.main.giveMeMore(
            event.target.password.value,
            this.rootStore.send.fromAddress,
        );

        await this.rootStore.gasPrice.update();
    };

    protected handleBuySonm = (event: any) => {
        this.setState({
            currency:
                event.target.id === 'Ether' ? Currencies.eth : Currencies.snm,
            visibleDialog: Dialogs.changelly,
        });
    };

    protected closeDialog = () => {
        this.setState({
            visibleDialog: Dialogs.none,
        });
    };

    public render() {
        const { className } = this.props;
        const rootStore = this.rootStore;
        const testEtherUrl = 'https://faucet.rinkeby.io/';

        return (
            <div className={cn('sonm-account', className)} key="account">
                <AccountBigSelect
                    className="sonm-account__account-select"
                    returnPrimitive
                    accounts={rootStore.myProfiles.accountList}
                    primaryTokenInfo={this.rootStore.currency.primaryTokenInfo}
                    onChange={this.handleChangeAccount}
                    value={rootStore.send.fromAddress}
                />

                <button
                    className="sonm-account__go-to-history"
                    onClick={this.handleClickHistory}
                >
                    View operation history
                </button>

                {rootStore.send.currentBalanceList.length === 0 ? null : (
                    <ul className="sonm-account__tokens">
                        <Header className="sonm-account__header">
                            Coins and tokens
                        </Header>
                        {rootStore.send.currentBalanceList.map(
                            (
                                {
                                    symbol,
                                    address,
                                    name,
                                    balance,
                                    decimalPointOffset,
                                },
                                index,
                            ) => {
                                return (
                                    <li
                                        className="sonm-account-token-list__currency"
                                        key={address}
                                    >
                                        <IdentIcon
                                            address={address}
                                            sizePx={40}
                                            className="sonm-account-token-list__currency-blockies"
                                        />
                                        <div className="sonm-account-token-list__currency-name">
                                            {name}
                                        </div>
                                        <Balance
                                            className="sonm-account-token-list__currency-balance"
                                            balance={balance}
                                            symbol={symbol}
                                            decimalPointOffset={
                                                decimalPointOffset
                                            }
                                        />
                                        {rootStore.wallet.networkName ===
                                            'livenet' && index < 2 ? (
                                            <div
                                                className="sonm-account__buy-sonm-button"
                                                onClick={this.handleBuySonm}
                                                id={symbol}
                                            >
                                                {'Buy'}
                                                <div className="sonm-account__visa-mastercard-icon" />
                                            </div>
                                        ) : null}
                                        <div
                                            className="sonm-account-token-list__currency__send-button"
                                            onClick={this.handleSendClick}
                                            id={address}
                                        >
                                            {rootStore.localizator.getMessageText(
                                                'send',
                                            )}
                                            <div className="sonm-account-token-list__currency__send-icon" />
                                        </div>
                                    </li>
                                );
                            },
                        )}
                    </ul>
                )}

                {rootStore.wallet.networkName === 'rinkeby' ? (
                    <form
                        onSubmit={this.handleGiveMeMore}
                        className="sonm-account__give-me"
                    >
                        <Header className="sonm-account__header">
                            {rootStore.localizator.getMessageText(
                                'test_token_request',
                            )}
                        </Header>
                        <div className="sonm-account__warning">
                            {rootStore.localizator.getMessageText(
                                'you_need_test_ether',
                            )}
                            <a href={testEtherUrl} target="_blank">
                                {testEtherUrl}
                            </a>
                        </div>
                        <div className="sonm-account__give-me-ct">
                            <Input
                                autoComplete="off"
                                name="password"
                                className="sonm-account__give-me-password"
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ fontSize: 13 }}
                                    />
                                }
                                type="password"
                                placeholder="Account password"
                            />
                            <Button
                                type="submit"
                                className="sonm-account__give-me-button"
                                square
                                transparent
                            >
                                {rootStore.localizator.getMessageText(
                                    'give_me_more',
                                )}
                            </Button>
                        </div>
                    </form>
                ) : null}

                {rootStore.wallet.networkName === 'livenet' &&
                this.state.visibleDialog === Dialogs.changelly ? (
                    <Changelly
                        onClickCross={this.closeDialog}
                        currency={this.state.currency}
                        address={rootStore.send.fromAddress}
                    />
                ) : null}
            </div>
        );
    }
}

export const Account = withRootStore(observer(AccountLayout));
