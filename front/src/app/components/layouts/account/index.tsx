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
import { injectRootStore, IHasRootStore } from '../layout';
import { RootStore } from 'app/stores';

interface IProps extends IHasRootStore {
    className?: string;
    initialAddress: string;
    onClickHistory: (fromAddress?: TEthereumAddress) => void;
    onClickSend: () => void;
}

enum Dialogs {
    giveMe = 'giveMe',
    none = '',
}

@injectRootStore
@observer
export class Account extends React.Component<IProps, any> {
    // ToDo make stateless

    protected get rootStore() {
        return this.props.rootStore as RootStore;
    }

    public state = {
        visibleDialog: Dialogs.none,
    };

    public componentWillMount() {
        if (this.props.initialAddress) {
            this.rootStore.sendStore.setUserInput({
                fromAddress: this.props.initialAddress,
            });
        }
    }

    protected handleChangeAccount = (accountAddress: any) => {
        this.rootStore.sendStore.setUserInput({
            fromAddress: accountAddress,
        });
    };

    protected handleClickHistory = () => {
        this.props.onClickHistory(this.rootStore.sendStore.fromAddress);
    };

    protected handleSendClick = (event: any) => {
        const currencyAddress = event.target.name;

        this.rootStore.sendStore.setUserInput({
            currencyAddress,
        });

        this.props.onClickSend();
    };

    protected handleGiveMeMore = async (event: any) => {
        event.preventDefault();

        await this.rootStore.mainStore.giveMeMore(
            event.target.password.value,
            this.rootStore.sendStore.fromAddress,
        );

        await this.rootStore.gasPrice.update();
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
                    accounts={rootStore.myProfilesStore.accountList}
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
                            ({
                                symbol,
                                address,
                                name,
                                balance,
                                decimalPointOffset,
                            }) => {
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
                                        <button
                                            name={address}
                                            className="sonm-account-token-list__currency-button"
                                            onClick={this.handleSendClick}
                                        >
                                            {rootStore.localizator.getMessageText(
                                                'send',
                                            )}
                                        </button>
                                    </li>
                                );
                            },
                        )}
                    </ul>
                )}

                {rootStore.walletStore.networkName === 'rinkeby' ? (
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
            </div>
        );
    }
}
