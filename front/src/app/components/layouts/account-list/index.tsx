import * as React from 'react';
import * as cn from 'classnames';
import { observer } from 'mobx-react';
import { rootStore } from 'app/stores/';
import {
    AccountItem,
    IAccountItemProps,
} from 'app/components/common/account-item';
import { CurrencyBalanceList } from 'app/components/common/currency-balance-list';
import { DeletableItemWithConfirmation } from 'app/components/common/deletable-item/with-confirmation';
import { Header } from 'app/components/common/header';
import { Button } from 'app/components/common/button';
import { AddAccount, IAddAccountForm } from './sub/add-account';
import { CreateAccount, ICreateAccountForm } from './sub/create-account';
import { EmptyAccountList } from './sub/empty-account-list';
import { AddToken } from './sub/add-token';
import { navigate } from 'app/router/navigate';
import { IValidation } from 'app/api/types';
import { DeleteAccountConfirmation } from './sub/delete-account-confirmation';
import { DownloadFile } from 'app/components/common/download-file';
import { Icon } from 'app/components/common/icon';
import ShowPassword from './sub/show-private-key/index';

enum WalletDialogs {
    new,
    add,
    addToken,
    none,
    showPrivateKey,
}

interface IProps {
    className?: string;
}

interface IState {
    deleteAddress: string;
    visibleDialog: WalletDialogs;
    visibleDialogProps: any[];
    validation?: IValidation;
}

const emptyValidation: IValidation = {};

class DeletableItem extends DeletableItemWithConfirmation<IAccountItemProps> {}

@observer
export class Wallets extends React.Component<IProps, IState> {
    public state = {
        deleteAddress: '',
        visibleDialog: WalletDialogs.none,
        visibleDialogProps: [] as any[],
        validation: emptyValidation,
    };

    protected handleClickAccount(address: string) {
        navigate({ path: `/accounts/${address}` }); // TODO move to router
    }

    private handleDelete = (deleteAddress: string) => {
        rootStore.mainStore.deleteAccount(deleteAddress);
    };

    protected isValidationEmpty(validation: IValidation) {
        return Object.keys(validation).every(x => validation[x] === '');
    }

    protected handleAddAccount = async (data: IAddAccountForm) => {
        const validation: IValidation = (await rootStore.mainStore.addAccount(
            data.json,
            data.password,
            data.name,
        )) as any; // ;(

        this.setState({ validation });

        if (this.isValidationEmpty(validation)) {
            this.closeDialog();
        }
    };

    protected handleCreateAccount = async (data: ICreateAccountForm) => {
        await rootStore.mainStore.createAccount(
            data.password,
            data.name,
            data.privateKey,
        );

        this.closeDialog();
    };

    protected switchDialog(name: WalletDialogs, ...args: any[]) {
        this.setState({
            visibleDialog: name,
            visibleDialogProps: args,
        });
    }

    protected closeDialog = () => {
        this.setState({ validation: emptyValidation });
        this.switchDialog(WalletDialogs.none);
    };
    protected openNewWalletDialog = this.switchDialog.bind(
        this,
        WalletDialogs.new,
    );
    protected openAddWalletDialog = this.switchDialog.bind(
        this,
        WalletDialogs.add,
    );

    protected handleRename = (address: string, name: string) => {
        rootStore.mainStore.renameAccount(address, name);
    };

    protected handleRequireAddToken = () => {
        this.switchDialog(WalletDialogs.addToken);
    };

    protected handleDeleteToken = (address: string) => {
        rootStore.mainStore.removeToken(address);
    };

    protected handleShowPrivateKey = (address: string) => {
        this.switchDialog(WalletDialogs.showPrivateKey, address);
    };

    public render() {
        const { className } = this.props;

        return (
            <div className={cn('sonm-accounts', className)}>
                <Header className="sonm-accounts__header">Accounts</Header>
                <DownloadFile
                    getData={rootStore.mainStore.getWalletExportText}
                    className="sonm-accounts__export-wallet"
                    fileName={`sonm-wallet-${
                        rootStore.mainStore.walletName
                    }.json`}
                >
                    <Button
                        tag="div"
                        color="gray"
                        square
                        transparent
                        height={40}
                        className="sonm-accounts__export-wallet-button"
                    >
                        <Icon i="Export" />
                        {' Export wallet'}
                    </Button>
                </DownloadFile>
                <div className="sonm-accounts__list">
                    {rootStore.mainStore.accountList.length === 0 ? (
                        <EmptyAccountList />
                    ) : (
                        rootStore.mainStore.accountList.map(
                            (x: IAccountItemProps) => {
                                return (
                                    <DeletableItem
                                        item={x}
                                        Confirmation={DeleteAccountConfirmation}
                                        className="sonm-accounts__list-item"
                                        onDelete={this.handleDelete}
                                        key={x.address}
                                        id={x.address}
                                    >
                                        <AccountItem
                                            {...x}
                                            onClickIcon={
                                                this.handleClickAccount
                                            }
                                            onClickShowPrivateKey={
                                                this.handleShowPrivateKey
                                            }
                                            onRename={this.handleRename}
                                            className="sonm-accounts__list-item-inner"
                                            hasButtons
                                        />
                                    </DeletableItem>
                                );
                            },
                        )
                    )}
                </div>
                <CurrencyBalanceList
                    className="sonm-accounts__balances"
                    currencyBalanceList={rootStore.mainStore.fullBalanceList}
                    onRequireAddToken={
                        rootStore.isOffline
                            ? undefined
                            : this.handleRequireAddToken
                    }
                    onDeleteToken={this.handleDeleteToken}
                />
                <div className="sonm-accounts__buttons">
                    <Button
                        type="button"
                        onClick={this.openAddWalletDialog}
                        color="violet"
                        className="sonm-accounts__button"
                    >
                        IMPORT ACCOUNT
                    </Button>
                    <Button
                        type="button"
                        onClick={this.openNewWalletDialog}
                        className="sonm-accounts__button"
                    >
                        CREATE ACCOUNT
                    </Button>
                    {this.state.visibleDialog === WalletDialogs.new ? (
                        <CreateAccount
                            validation={this.state.validation}
                            onSubmit={this.handleCreateAccount}
                            onClickCross={this.closeDialog}
                        />
                    ) : null}
                    {this.state.visibleDialog === WalletDialogs.add ? (
                        <AddAccount
                            existingAccounts={
                                rootStore.mainStore.accountAddressList
                            }
                            validation={this.state.validation}
                            onSubmit={this.handleAddAccount}
                            onClickCross={this.closeDialog}
                        />
                    ) : null}
                    {this.state.visibleDialog === WalletDialogs.addToken ? (
                        <AddToken onClickCross={this.closeDialog} />
                    ) : null}
                    {this.state.visibleDialog ===
                    WalletDialogs.showPrivateKey ? (
                        <ShowPassword
                            address={this.state.visibleDialogProps[0]}
                            onClose={this.closeDialog}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}

// TODO
