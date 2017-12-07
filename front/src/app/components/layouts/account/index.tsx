import * as React from 'react';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../../stores/main';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import Header from '../../common/header';
import IdentIcon from '../../common/ident-icon/index';
import { navigate } from 'app/router';

interface IProps {
    className?: string;
    mainStore?: MainStore;
    initialAddress: string;
}

@inject('mainStore')
@observer
export class Account extends React.Component<IProps, any> {
    public componentWillMount() {
        if (!this.props.mainStore) { return; }

        this.props.initialAddress && this.props.mainStore.selectAccount(this.props.initialAddress);
    }

    protected handleChangeAccount = (accountAddres: any) => {
        this.props.mainStore && this.props.mainStore.selectAccount(accountAddres);
    }

    protected handleHistoryClick = () => {
        if (!this.props.mainStore) { return; }

        navigate({
            path: '/history',
            query: {
                address: this.props.mainStore.selectedAccountAddress,
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

    public render() {
        if (!this.props.mainStore) { return null; }

        const {
            className,
        } = this.props;

        return [
            <Header className="sonm-wallets__header" key="header">
                Account
            </Header>,
            <div className={cn('sonm-account', className)} key="account">
                <AccountBigSelect
                    className="sonm-account__account-select"
                    returnPrimitive
                    accounts={this.props.mainStore.accountList}
                    onChange={this.handleChangeAccount}
                    value={this.props.mainStore.selectedAccountAddress}
                />

                <button
                    className="sonm-account__go-to-history"
                    onClick={this.handleHistoryClick}
                >
                    View operation history
                </button>

                <ul className="sonm-account__tokens" >
                    <Header className="sonm-wallets__header">
                        Tokens
                    </Header>
                    {this.props.mainStore.currentBalanceList.map(({ symbol, address, name, balance, decimals }) => {
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
                </ul>
            </div>,
        ];
    }
}
