import * as React from 'react';
import * as cn from 'classnames';
import { Button } from 'app/components/common/button';
import { Api, NetworkEnum } from 'app/api';
import { IValidation } from 'ipc/types';
import { BlackSelect } from 'app/components/common/black-select';
import { Dialog } from 'app/components/common/dialog';
import { LoadMask } from 'app/components/common/load-mask';
import { setFocus } from 'app/components/common/utils/setFocus';
import { getMessageText } from 'app/api/error-messages';
import { IWalletListItem } from 'app/api/types';
import { IFileOpenResult, Upload } from 'app/components/common/upload';
import { Form, FormButtons, FormHeader, FormRow, FormField } from 'app/components/common/form';
import shortString from '../../../utils/short-string';

interface IProps {
    className?: string;
    onLogin: (wallet: IWalletListItem) => void;
}

class BlackWalletSelect extends BlackSelect<IWalletListItem> {}

type TAction = 'select-wallet' | 'create-new' | 'enter-password' | 'import-wallet';

interface IRefs {
    loginBtn: Button | null;
}

const networkSelectList = [NetworkEnum.live, NetworkEnum.rinkeby].map(x => x.toString());

const emptyValidation: IValidation = {};

interface IState {
    currentAction: TAction;
    password: string;
    newName: string;
    newPassword: string;
    newPasswordConfirmation: string;
    encodedWallet: string;
    encodedWalletFileName: string;
    listOfWallets: IWalletListItem[];
    name: string;
    pending: boolean;
    error: string;
    network: NetworkEnum;
    validation: IValidation;
}

const emptyForm: Pick<IState, any> = {
    password: '',
    newName: '',
    newPassword: '',
    newPasswordConfirmation: '',
    encodedWallet: '',
    encodedWalletFileName: '',
};

export class Login extends React.Component<IProps, IState> {
    protected nodes: IRefs = {
        loginBtn: null,
    };

    public state = {
        currentAction: ('select-wallet' as TAction),
        password: '',
        newName: '',
        newPassword: '',
        newPasswordConfirmation: '',
        encodedWallet: '',
        encodedWalletFileName: '',
        listOfWallets: ([] as IWalletListItem[]),
        name: '',
        pending: false,
        error: '',
        network: NetworkEnum.live,
        validation: emptyValidation,
    };

    protected getWalletList = async () =>  {
        this.setState({ pending: true });

        const { data: walletlList } = await Api.getWalletList();

        if (walletlList === undefined) {
            return;
        }

        const listOfWallets = walletlList;

        let name = '';
        const savedName = window.localStorage.getItem('sonm-last-used-wallet');

        if (savedName && listOfWallets.some(x => x.name === savedName)) {
            name = savedName;
        } else if (listOfWallets.length > 0) {
            name = listOfWallets[0].name;
        }

        const update: any = { // TODO use Partial<IState>
            pending: false,
            listOfWallets,
            name,
        };

        if (listOfWallets.length === 1) {
            update.name = listOfWallets[0].name;
            update.currentAction = 'enter-password';
        }

        if (listOfWallets.length === 0) {
            update.currentAction = 'create-new';
        }

        this.setState(update);
    }

    protected async fastLogin() {
        if (window.localStorage.getItem('sonm-4ever')) {
            const { data } = await Api.unlockWallet('1', '1');
            if (data) {
                const wallet = this.findWalletByName('1');

                this.props.onLogin(wallet);
            }
        }
    }

    public componentWillMount() {
        this.fastLogin();

        this.getWalletList();
    }

    protected openDialog(currentAction: TAction, event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();

        const update: Pick<IState, any> = { ...emptyForm };

        update.currentAction = currentAction;

        this.setState(update);
    }

    protected handleStartLogin = this.openDialog.bind(this, 'enter-password');
    protected handleStartCreateNew = this.openDialog.bind(this, 'create-new');
    protected handleStartImport = this.openDialog.bind(this, 'import-wallet');

    protected findWalletByName(name: string) {
        const wallet = this.state.listOfWallets.find(x => x.name === this.state.name);

        if (wallet === undefined) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }

    protected handleSubmitLogin = async (event: any) => {
        event.preventDefault();

        this.setState({ pending: true });

        try {
            const { validation, data: success } = await Api.unlockWallet(this.state.password, this.state.name);

            if (validation) {
                this.setState({ validation });
            }

            const wallet = this.findWalletByName(this.state.name);

            if (success) {
                this.props.onLogin(wallet);
                return;
            }

        } catch (e) {
            this.setState({ error: String(e) });
        }

        this.setState({ pending: false });
    }

    protected handleSubmitCreate = async (event: any) => {
        event.preventDefault();

        const valid = this.validateNewName() && this.validateNewPassword();

        if (valid) {
            this.setState({
                pending: true,
            });

            try {
                const { validation, data: walletListItem } = await Api.createWallet(
                    this.state.newPassword,
                    this.state.newName,
                    this.state.network.toString(),
                );

                if (validation) {
                    this.setState({ validation });
                } else if (walletListItem) {
                    window.localStorage.setItem('sonm-last-used-wallet', this.state.newName);

                    this.props.onLogin(walletListItem);
                    return;
                }

            } catch (e) {

                this.setState({
                    pending: false,
                    error: String(e),
                });
            }
        }
    }

    protected handleSubmitImport = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valid = this.validateNewName();

        if (valid) {
            this.setState({
                pending: true,
            });

            const { password, newName, encodedWallet } = this.state;

            const { data: walletInfo, validation } = await Api.importWallet(password, newName, encodedWallet);

            if (validation) {
                this.setState({
                    validation,
                    pending: false,
                });
            } else if (walletInfo) {
                this.props.onLogin(walletInfo);
                return;
            }
        }
    }

    protected validateNewName() {
        let valid = true;

        if (this.state.newName.length < 1 || this.state.newName.length > 20) {
            this.setState({ validation: { newName: getMessageText('wallet_name_length') } });
            valid = false;
        } else {
            const foundByName = this.state.listOfWallets.find(x => x.name === this.state.newName);
            if (foundByName) {
                this.setState({ validation: { newName: getMessageText('wallet_allready_exists') } });
                valid = false;
            }
        }

        return valid;
    }

    protected validateNewPassword() {
        let valid = true;

        if (this.state.newPassword.length < 1) {
            this.setState({ validation: { newPassword: getMessageText('password_required') } });
            valid = false;
        }

        if (this.state.newPassword !== this.state.newPasswordConfirmation) {
            this.setState({ validation: { newPasswordConfirmation: getMessageText('password_not_match') } });
            valid = false;
        }

        return valid;
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    protected handleChangeSelect = (params: any) => {
        this.setState({
            [params.name]: params.value,
        });
    }

    protected handleChangeWallet = (params: any) => {
        this.setState(
            { name: params.value },
            () => this.nodes.loginBtn && this.nodes.loginBtn.focus(),
        );

        window.localStorage.setItem('sonm-last-used-wallet', params.value);
    }

    protected handleReturn = () => {
        this.setState({ currentAction: 'select-wallet', validation: {} });
    }

    protected saveLoginBtnRef = (ref: Button | null) => {
        if (!ref) { return; }

        if (!this.nodes.loginBtn) {
            ref.focus();
        }

        this.nodes.loginBtn = ref;
    }

    protected renderWalletOption(record: IWalletListItem) {
        return <span className={`sonm-login__wallet-option--${record.chainId}`}>
            {record.name}
        </span>;
    }

    protected renderSelect() {
        return (
            <form className="sonm-login__wallet-form" onSubmit={this.handleStartLogin}>
                <BlackWalletSelect
                    render={this.renderWalletOption}
                    className="sonm-login__wallet-select"
                    name="name"
                    onChange={this.handleChangeWallet}
                    value={this.state.name}
                    keyIndex="name"
                    options={this.state.listOfWallets}
                />
                <Button
                    height={50}
                    square
                    className="sonm-login__wallet-login"
                    onClick={this.handleStartLogin}
                    type="submit"
                    ref={this.saveLoginBtnRef}
                    disabled={this.state.listOfWallets.length === 0}
                >
                    Login
                </Button>
            </form>
        );
    }

    protected handleOpenTextFile = (params: IFileOpenResult) => {
        if (params.error) {
            this.setState({
                validation: { encodedWallet: params.error },
                encodedWallet: '',
            });
        } else {
            this.setState({
                validation: {},
                encodedWallet: params.text,
                encodedWalletFileName: params.fileName,
            });
        }
    }

    protected renderImportWalletPopup() {
        if (this.state.currentAction !== 'import-wallet') {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <Form onSubmit={this.handleSubmitImport} className="sonm-login__form">
                    <FormHeader>Import wallet</FormHeader>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Wallet file"
                            error={this.state.validation.encodedWallet}
                            success={this.state.encodedWalletFileName
                                ? shortString(this.state.encodedWalletFileName, 20)
                                : ''
                            }
                        >
                            <Upload
                                onOpenTextFile={this.handleOpenTextFile}
                                buttonProps={{
                                    square: true,
                                    height: 40,
                                    transparent: true,
                                }}
                            >
                                Select file
                            </Upload>
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Wallet name"
                            error={this.state.validation.newName}
                        >
                            <input
                                autoComplete="off"
                                ref={setFocus}
                                type="newName"
                                className="sonm-login__input"
                                name="newName"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Password for file"
                            error={this.state.validation.password}
                        >
                            <input
                                autoComplete="off"
                                ref={setFocus}
                                type="password"
                                className="sonm-login__input"
                                name="password"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button
                            className="sonm-login__import"
                            type="submit"
                        >
                            Import
                        </Button>
                    </FormButtons>
                </Form>
            </Dialog>
        );
    }

    protected renderLoginPopup() {
        if (this.state.currentAction !== 'enter-password') {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <form className="sonm-login__popup-content" onSubmit={this.handleSubmitLogin}>
                    <h3 className="sonm-login__popup-header">Enter password</h3>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Password</span>
                        <span className="sonm-login__label-error">{this.state.validation.password}</span>
                        <input
                            autoComplete="off"
                            ref={setFocus}
                            type="password"
                            className="sonm-login__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <Button
                        className="sonm-login__create"
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </Dialog>
        );
    }

    protected renderCreateWalletPopup() {
        if (this.state.currentAction !== 'create-new') {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <form className="sonm-login__popup-content" onSubmit={this.handleSubmitCreate}>
                    <h3 className="sonm-login__popup-header">New wallet</h3>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Wallet name</span>
                        <span className="sonm-login__label-error">{this.state.validation.newName}</span>
                        <input
                            autoComplete="off"
                            ref={setFocus}
                            type="text"
                            className="sonm-login__input"
                            name="newName"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Password</span>
                        <span className="sonm-login__label-error">{this.state.validation.newPassword}</span>
                        <input
                            autoComplete="off"
                            type="password"
                            className="sonm-login__input"
                            name="newPassword"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Confirm password</span>
                        <span className="sonm-login__label-error">{this.state.validation.newPasswordConfirmation}</span>
                        <input
                            autoComplete="off"
                            type="password"
                            className="sonm-login__input"
                            name="newPasswordConfirmation"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Ethereum network</span>
                        <BlackSelect
                            value={this.state.network.toString()}
                            name="network"
                            className="sonm-login__network-type"
                            onChange={this.handleChangeSelect}
                            options={networkSelectList}
                        />
                    </label>
                    <Button
                        className="sonm-login__create"
                        type="submit"
                    >
                        Create wallet
                    </Button>
                </form>
            </Dialog>
        );
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <LoadMask visible={this.state.pending} className="sonm-login__spin">
                <div className={cn('sonm-login', className)}>
                    <div className="sonm-login__errors">
                        {this.state.error}
                    </div>
                    <div
                        className={cn(
                            'sonm-login__center', {
                            'sonm-login__center--blurred': this.state.currentAction !== 'select-wallet',
                        })}
                    >
                        <div className="sonm-login__logo" />
                        {this.renderSelect()}
                        <div className="sonm-login__actions">
                            <a
                                href="#create"
                                className="sonm-login__create-button"
                                onClick={this.handleStartCreateNew}
                            >
                                Create wallet
                            </a>
                            <a
                                href="#import"
                                className="sonm-login__import-button"
                                onClick={this.handleStartImport}
                            >
                                Import wallet
                            </a>
                        </div>
                    </div>
                    {this.renderCreateWalletPopup()}
                    {this.renderLoginPopup()}
                    {this.renderImportWalletPopup()}
                </div>
                <div className="sonm-login__version">Version: {VERSION}</div>
            </LoadMask>
        );
    }
}
