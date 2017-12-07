import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import AccountItem from '../../common/account-item/index';
import CurrencyBalanceList from '../../common/currency-balance-list/index';
import DeletableItem from '../../common/deletable-item/index';
import Header from '../../common/header';
import Button from '../../common/button';
import AddAccount from './sub/add-account';

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

@inject('mainStore')
@observer
export class Wallets extends React.Component<IProps, any> {
    public state = {
        deleteAddress: '',
        showAddAccount: false,
    }

    private handleDelete = (deleteAddress: string) => {
        if (this.props.mainStore === undefined) {
            return;
        }

        this.props.mainStore.deleteAccount(deleteAddress);
    }

    protected handleAddAccount = async (data: any) => {
        if (this.props.mainStore === undefined) {
            return;
        }

        await this.props.mainStore.addAccount(
            data.json,
            data.password,
            data.name,
        );

        this.setState({
            showAddAccount: false,
        });
    }

    protected handleHideAddAccount = async () => {
        this.setState({
            showAddAccount: false,
        });
    }

    private handleRename = (address: string, name: string) => {
        if (this.props.mainStore === undefined) {
            return;
        }

        this.props.mainStore.renameAccount(address, name);
    }

    private renderAddAccount() {
        return this.state.showAddAccount ?
            (<AddAccount onSubmit={this.handleAddAccount} onClickCross={this.handleHideAddAccount} className="sonm-wallets__add-button"/>) : null;
    }

    protected handleStartAddAccount = (event: any) => {
        event.preventDefault();

        this.setState({
            showAddAccount: true,
        });
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
                                <AccountItem {...x} onRename={this.handleRename}/>
                            </DeletableItem>
                        );
                    })}
                </div>
                <CurrencyBalanceList
                    className="sonm-wallets__balances"
                    currencyBalanceList={mainStore.fullBalanceList}
                />
                <Button type="button" onClick={this.handleStartAddAccount} className="sonm-wallets__add-button">
                    Add account
                </Button>
                {this.renderAddAccount()}
            </div>
        );
    }
}
