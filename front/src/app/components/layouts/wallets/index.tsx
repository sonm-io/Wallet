import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import { AccountItem } from 'app/components/common/account-item';
import { CurrencyBalanceList } from 'app/components/common/currency-balance-list';
import { DeletableItem } from 'app/components/common/deletable-item';
import { Header } from 'app/components/common/header';
import { Button } from 'app/components/common/button';
import { AddAccount, IAddAccountForm } from './sub/add-account';
import { EmptyAccountList } from './sub/empty-account-list';
import { navigate } from 'app/router/navigate';
import { IValidation } from 'ipc';

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
        validation: {} as IValidation ,
    };

    protected handleAccountClick(address: string) {
        navigate({ path: `/accounts/${address}` });
    }

    private handleDelete = (deleteAddress: string) => {
        if (!this.props.mainStore) { return; }

        this.props.mainStore.deleteAccount(deleteAddress);
    }

    protected handleAddAccount = async (data: IAddAccountForm) => {
        if (!this.props.mainStore) { return; }

        const validation = await this.props.mainStore.addAccount(
            data.json,
            data.password,
            data.name,
        ) as any || {};

        if (Object.keys(validation).length === 0) {
            this.setState({
                showAddAccount: false,
                validation,
            });
        } else {
            this.setState({
                validation,
            });
        }
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
        if (!this.props.mainStore) { return null; }

        return this.state.showAddAccount
            ? (
                <AddAccount
                    existingAccounts={Array.from(this.props.mainStore.accountMap.keys())}
                    validation={this.state.validation}
                    onSubmit={this.handleAddAccount}
                    onClickCross={this.handleHideAddAccount}
                    className="sonm-wallets__add-button"
                />
            )
            : null;
    }

    protected handleStartAddAccount = () => {
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

        let list = null;
        if (mainStore.accountList.length === 0) {
            list = <EmptyAccountList/>;
        } else {
            list = mainStore.accountList.map(x => {
                return (
                    <DeletableItem
                        className="sonm-wallets__list-item"
                        onDelete={this.handleDelete}
                        key={x.address}
                        id={x.address}
                    >
                        <AccountItem
                            {...x}
                            onClickIcon={this.handleAccountClick}
                            onRename={this.handleRename}
                        />
                    </DeletableItem>
                );
            });
        }

        return (
            <div className={cn('sonm-wallets', className)}>
                <Header className="sonm-wallets__header">
                    Accounts
                </Header>
                <div className="sonm-wallets__list">
                    {list}
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