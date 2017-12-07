import * as React from 'react';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../../stores/main';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import Header from '../../common/header';
import IdentIcon from '../../common/ident-icon/index';
import { history } from '../../../router/history';

interface IProps {
    className?: string;
    mainStore?: MainStore;
    address: string;
}

@inject('mainStore')
@observer
export class Account extends React.Component<IProps, any> {
    public state = {
        address: '',
    };

    constructor(props: IProps) {
        super(props);
        this.state = { address: this.props.address };
    }

    protected handleChangeAccount = (value: any) => {
        this.setState({address: value as string});
    }

    protected handleHistoryClick() {
        history.push(`/history/${this.state.address}`);
    }

    protected handleSendClick(currencyAddress: string) {
        history.push(`/send/${this.state.address}/${currencyAddress}`);
    }

    public render() {
        if (this.props.mainStore === undefined) {
            return null;
        }

        const {
            className,
        } = this.props;

        const account = this.props.mainStore.accountList.find(item => item.address === this.state.address);

        return (
                <div className={cn('sonm-account', className)}>
                    <Header className="sonm-wallets__header">
                        Account
                    </Header>

                    <div className="sonm-account__top">
                        <AccountBigSelect
                            className="sonm-account__top__account"
                            returnPrimitive
                            accounts={this.props.mainStore.accountList}
                            onChange={this.handleChangeAccount}
                            value={this.state.address}
                        />

                        <div className="sonm-account__top__history" onClick={this.handleHistoryClick.bind(this)}/>
                    </div>


                    <Header className="sonm-wallets__header">
                        Tokens
                    </Header>

                    <ul className="sonm-account-token-list__list" >
                        {this.props.mainStore.currentBalanceList.map(({ symbol, address, name }) => {
                            let balance = '0';

                            if (account) {
                                balance = (address && address === '0x') ? account.secondBalance : account.firstBalance;
                            }

                            return (
                                <li className="sonm-account-token-list__item" key={address}>
                                    <IdentIcon address={address} width={40} className="sonm-account-token-list__item__blockies"/>
                                    <span className="sonm-account-token-list__item__name">{name}</span>
                                    <span className="sonm-account-token-list__item__balance">{balance}</span>
                                    <span className="sonm-account-token-list__item__button" onClick={this.handleSendClick.bind(this, address)}>Send</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
        );
    }
}
