import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { MainStore } from 'app/stores/main';
import { AccountItem, IAccountItemProps } from 'app/components/common/account-item';
import { CurrencyBalanceList } from 'app/components/common/currency-balance-list';
import { DeletableItemWithConfirmation } from 'app/components/common/deletable-item/with-confirmation';
import { Header } from 'app/components/common/header';
import { Button } from 'app/components/common/button';
import { AddAccount, IAddAccountForm } from './sub/add-account';
import { CreateAccount, ICreateAccountForm } from './sub/create-account';
import { EmptyAccountList } from './sub/empty-account-list';
import { navigate } from 'app/router/navigate';
import { IValidation } from 'app/api/types';
import { DeleteAccountConfirmation } from './sub/delete-account-confirmation';

enum WalletDialogs {
    new = 'new',
    add = 'add',
    none = '',
}

interface IProps {
    className?: string;
    mainStore?: MainStore;
}

interface IState {
    deleteAddress: string;
    visibleDialog: WalletDialogs;
    validation?: IValidation;
}

class DeletableItem extends DeletableItemWithConfirmation<IAccountItemProps> {}

@inject('mainStore')
@observer
export class Wallets extends React.Component<IProps, IState> {
    public state = {
        deleteAddress: '',
        visibleDialog: WalletDialogs.none,
        validation: {} as IValidation ,
    };

    protected get mainStore(): MainStore {
        if (!this.props.mainStore) { throw new Error('mainStore is undefined'); }

        return this.props.mainStore;
    }

    protected handleClickAccount(address: string) {
        navigate({ path: `/accounts/${address}` }); // TODO move to router
    }

    private handleDelete = (deleteAddress: string) => {
        this.mainStore.deleteAccount(deleteAddress);
    }

    protected isValidationEmpty(obj: object) {
        return Object.keys(obj).length === 0;
    }

    protected handleAddAccount = async (data: IAddAccountForm) => {

        const validation: IValidation = await this.mainStore.addAccount(
            data.json,
            data.password,
            data.name,
        ) as any; // ;(

        this.setState({ validation });

        if (this.isValidationEmpty(validation)) {
            this.closeDialog();
        }
    }

    protected handleCreateAccount = async (data: ICreateAccountForm) => {
        await this.mainStore.createAccount(
            data.password,
            data.name,
        );

        this.closeDialog();
    }

    protected switchDialog(name: WalletDialogs) {
        this.setState({
            visibleDialog: name,
        });
    }

    protected closeDialog = this.switchDialog.bind(this, WalletDialogs.none);
    protected openNewWalletDialog = this.switchDialog.bind(this, WalletDialogs.new);
    protected openAddWalletDialog = this.switchDialog.bind(this, WalletDialogs.add);

    protected handleRename = (address: string, name: string) => {
        this.mainStore.renameAccount(address, name);
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={cn('sonm-wallets', className)}>
                <Header className="sonm-wallets__header">
                    Accounts
                </Header>
                <div className="sonm-wallets__list">
                    {this.mainStore.accountList.length === 0
                        ? <EmptyAccountList/>
                        : this.mainStore.accountList.map((x: IAccountItemProps) => {
                            return (
                                <DeletableItem
                                    item={x}
                                    Confirmation={DeleteAccountConfirmation}
                                    className="sonm-wallets__list-item"
                                    onDelete={this.handleDelete}
                                    key={x.address}
                                    id={x.address}
                                >
                                    <AccountItem
                                        {...x}
                                        onClickIcon={this.handleClickAccount}
                                        onRename={this.handleRename}
                                        hasButtons
                                    />
                                </DeletableItem>
                            );
                        })
                    }
                </div>
                <CurrencyBalanceList
                    className="sonm-wallets__balances"
                    currencyBalanceList={this.mainStore.fullBalanceList}
                />
                <div className="sonm-wallets__buttons">
                    <Button
                        type="button"
                        onClick={this.openAddWalletDialog}
                        className="sonm-wallets__button"
                    >
                        Add account
                    </Button>
                    <Button
                        type="button"
                        onClick={this.openNewWalletDialog}
                        className="sonm-wallets__button"
                    >
                        New account
                    </Button>
                    {this.state.visibleDialog === WalletDialogs.new
                        ? (
                            <CreateAccount
                                validation={this.state.validation}
                                onSubmit={this.handleCreateAccount}
                                onClickCross={this.closeDialog}
                                className="sonm-wallets__create-button"
                            />
                        )
                        : null}
                    {this.state.visibleDialog === WalletDialogs.add
                        ? (
                            <AddAccount
                                existingAccounts={Array.from(this.mainStore.accountMap.keys())}
                                validation={this.state.validation}
                                onSubmit={this.handleAddAccount}
                                onClickCross={this.closeDialog}
                                className="sonm-wallets__add-button"
                            />
                        )
                        : null}
                </div>
            </div>
        );
    }
}

// TODO
