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
import { rootStore } from 'app/stores';
import { TEthereumAddress } from 'app/entities/types';
import { Changelly } from './sub/changelly';

interface IProps {
    className?: string;
    initialAddress: string;
    onClickHistory: (fromAddress?: TEthereumAddress) => void;
    onClickSend: (currencyAddress: TEthereumAddress) => void;
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

@observer
export class Account extends React.Component<IProps, any> {
    public state = {
        visibleDialog: Dialogs.none,
        currency: Currencies.none,
    };

    public componentWillMount() {
        if (this.props.initialAddress) {
            rootStore.sendStore.setUserInput({
                fromAddress: this.props.initialAddress,
            });
        }
    }

    protected handleChangeAccount = (accountAddres: any) => {
        rootStore.sendStore.setUserInput({
            fromAddress: accountAddres,
        });
    };

    protected handleClickHistory = () => {
        this.props.onClickHistory(rootStore.sendStore.fromAddress);
    };

    protected handleSendClick = (event: any) => {
        const currencyAddress = event.target.id;
        this.props.onClickSend(currencyAddress);
    };

    protected handleGiveMeMore = async (event: any) => {
        event.preventDefault();

        await rootStore.mainStore.giveMeMore(
            event.target.password.value,
            rootStore.sendStore.fromAddress,
        );

        await rootStore.mainStore.update();
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

        const testEtherUrl = 'https://faucet.rinkeby.io/';

        return (
            <div className={cn('sonm-account', className)} key="account">
                <AccountBigSelect
                    className="sonm-account__account-select"
                    returnPrimitive
                    accounts={rootStore.mainStore.accountList}
                    onChange={this.handleChangeAccount}
                    value={rootStore.sendStore.fromAddress}
                />

                <button
                    className="sonm-account__go-to-history"
                    onClick={this.handleClickHistory}
                >
                    View operation history
                </button>

                {rootStore.sendStore.currentBalanceList.length === 0 ? null : (
                    <ul className="sonm-account__tokens">
                        <Header className="sonm-account__header">
                            Coins and tokens
                        </Header>
                        {rootStore.sendStore.currentBalanceList.map(
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
                                        {rootStore.mainStore.networkName ===
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

                {rootStore.mainStore.networkName === 'rinkeby' ? (
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

                {rootStore.mainStore.networkName === 'livenet' &&
                this.state.visibleDialog === Dialogs.changelly ? (
                    <Changelly
                        onClickCross={this.closeDialog}
                        currency={this.state.currency}
                        address={rootStore.sendStore.fromAddress}
                    />
                ) : null}
            </div>
        );
    }
}
