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
import { Button } from 'app/components/common/button';
import { ImportAccount, IImportAccountForm } from './sub/import-account';
import { CreateAccount, ICreateAccountForm } from './sub/create-account';
import { EmptyAccountList } from './sub/empty-account-list';
import { AddToken } from './sub/add-token';
import { navigate } from 'app/router/navigate';
import { DeleteAccountConfirmation } from './sub/delete-account-confirmation';
import { Changelly } from './sub/changelly';
import { DownloadFile } from 'app/components/common/download-file';
import { Icon } from 'app/components/common/icon';
import ShowPassword from './sub/show-private-key/index';
import { IValidation } from 'app/api/types';
import { IAccountItemView } from 'app/stores/types';

enum WalletDialogs {
    new,
    add,
    addToken,
    none,
    showPrivateKey,
    changelly,
}

interface IProps {
    className?: string;
}

interface IState {
    visibleDialog: WalletDialogs;
    visibleDialogProps: any[];
}

class DeletableItem extends DeletableItemWithConfirmation<IAccountItemProps> {}

@observer
export class Wallets extends React.Component<IProps, IState> {
    public state = {
        visibleDialog: WalletDialogs.none,
        visibleDialogProps: [] as any[],
    };

    protected handleClickAccount(address: string) {
        navigate({ path: `/wallet/accounts/${address}` }); // TODO move to router
    }

    private handleDelete = (deleteAddress: string) => {
        rootStore.mainStore.deleteAccount(deleteAddress);
    };

    protected handleAddAccount = async (data: IImportAccountForm) => {
        await rootStore.mainStore.addAccount(
            data.json,
            data.password,
            data.name,
        );

        if (rootStore.mainStore.noValidationMessages) {
            this.closeDialog();
        }
    };

    protected handleCreateAccount = async (data: ICreateAccountForm) => {
        await rootStore.mainStore.createAccount(
            data.password,
            data.name,
            data.privateKey,
        );

        if (rootStore.mainStore.noValidationMessages) {
            this.closeDialog();
        }
    };

    protected switchDialog(name: WalletDialogs, ...args: any[]) {
        this.setState({
            visibleDialog: name,
            visibleDialogProps: args,
        });
    }

    protected closeDialog = () => {
        rootStore.mainStore.resetServerValidation();
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

    protected handleBuySonm = () => {
        this.switchDialog(WalletDialogs.changelly);
    };

    public render() {
        const { className } = this.props;

        return (
            <div className={cn('sonm-accounts', className)}>
                <div className="sonm-accounts__balances">
                    <div
                        className="sonm-accounts__buy-sonm-button"
                        onClick={this.handleBuySonm}
                    >
                        {'Buy SONM'}
                        <div className="sonm-accounts__visa_mastercard_icon" />
                    </div>
                    <DownloadFile
                        getData={rootStore.mainStore.getWalletExportText}
                        className="sonm-accounts__export-wallet-button"
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
                    <CurrencyBalanceList
                        className="sonm-accounts__balance-list"
                        currencyBalanceList={
                            rootStore.mainStore.fullBalanceList
                        }
                        onRequireAddToken={
                            rootStore.isOffline
                                ? undefined
                                : this.handleRequireAddToken
                        }
                        onDeleteToken={this.handleDeleteToken}
                    />
                </div>
                <div className="sonm-accounts__list">
                    {rootStore.mainStore.accountList.length === 0 ? (
                        <EmptyAccountList />
                    ) : (
                        rootStore.mainStore.accountList.map(
                            (x: IAccountItemView) => {
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
                            serverValidation={
                                rootStore.mainStore
                                    .serverValidation as IValidation
                            }
                            onSubmit={this.handleCreateAccount}
                            onClickCross={this.closeDialog}
                        />
                    ) : null}
                    {this.state.visibleDialog === WalletDialogs.add ? (
                        <ImportAccount
                            existingAccounts={
                                rootStore.mainStore.accountAddressList
                            }
                            serverValidation={
                                rootStore.mainStore
                                    .serverValidation as IImportAccountForm
                            }
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
                    {this.state.visibleDialog === WalletDialogs.changelly ? (
                        <Changelly onClickCross={this.closeDialog} />
                    ) : null}
                </div>
            </div>
        );
    }
}

// TODO
