import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import AccountItem from '../../common/account-item/index';
import CurrencyBalanceList from '../../common/currency-balance-list/index';
import DeletableItem from '../../common/deletable-item/index';
import Header from '../../common/header';
import Upload from '../../common/upload';
import { history } from '../../../router/history';

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

@inject('mainStore')
@observer
export class Wallets extends React.Component<IProps, any> {
    public state = {
        deleteAddress: '',
    }

    protected handleAccountClick(address: string) {
        history.push(`/account/${address}`);
    }

    private handleDelete = (deleteAddress: string) => {
        if (this.props.mainStore === undefined) {
            return;
        }

        this.props.mainStore.deleteAccount(deleteAddress);
    }

    private handleOpenTextFile = (text?: string, error?: any) => {
        if (this.props.mainStore === undefined) {
            return;
        }

        if (error || !text) {
            window.alert(JSON.stringify(error || 'Empty account json'));
            return;
        }

        const password = window.prompt('password') || '';

        this.props.mainStore.addAccount(
            text,
            password,
            Math.random().toString(36).slice(3),
        );
    }

    private handleRename = (address: string, name: string) => {
        if (this.props.mainStore === undefined) {
            return;
        }

        this.props.mainStore.renameAccount(address, name);
    }

    public render() {
        const {
            className,
            mainStore,
        } = this.props;

        if (mainStore === undefined) {
            return;
        }

        return (
            <div className={cn('sonm-wallets', className)}>
                <Header className="sonm-wallets__header">
                    Accounts
                </Header>
                <div className="sonm-wallets__list">
                    {mainStore.accountList.map(x => {
                        return (
                            <DeletableItem
                                className="sonm-wallets__list-item"
                                onDelete={this.handleDelete}
                                key={x.address}
                                id={x.address}
                            >
                                <AccountItem {...x} onRename={this.handleRename} onClick={this.handleAccountClick.bind(this, x.address)}/>
                            </DeletableItem>
                        );
                    })}
                </div>
                <CurrencyBalanceList
                    className="sonm-wallets__balances"
                    currencyBalanceList={mainStore.fullBalanceList}
                />
                <Upload
                    onOpenTextFile={this.handleOpenTextFile}
                    className="sonm-wallets__add-button"
                >
                    + Add account
                </Upload>
            </div>
        );
    }
}
