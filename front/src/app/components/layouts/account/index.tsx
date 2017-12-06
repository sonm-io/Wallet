import * as React from 'react';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../../stores/main';
import { AccountBigSelect } from 'app/components/common/account-big-select';
import Header from '../../common/header';
import IdentIcon from '../../common/ident-icon/index';

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
    };

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

                    <AccountBigSelect
                        className="sonm-account__select-account"
                        returnPrimitive
                        accounts={this.props.mainStore.accountList}
                        onChange={this.handleChangeAccount}
                        value={this.state.address}
                    />

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
                                    <IdentIcon address={address} width={40} className="sonm-currency-balance-list__icon"/>
                                    <span className="sonm-currency-balance-list__name">{name}</span>
                                    <span className="sonm-currency-balance-list__balance">{balance}</span>
                                    <span className="sonm-currency-balance-list__button">SEND</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
        );
    }
}
