import * as React from 'react';
import * as cn from 'classnames';
import { Button } from 'app/components/common/button';
import { Api } from 'app/api';
import { IValidation } from 'ipc/types';
import { BlackSelect } from 'app/components/common/black-select';
import { Dialog } from 'app/components/common/dialog';
import { LoadMask } from 'app/components/common/load-mask';
import { setFocus } from 'app/components/common/utils/setFocus';
import { getMessageText } from 'app/api/error-messages';
import { IWalletListItem } from 'app/api/types';
import { Upload } from 'app/components/common/upload';

interface IProps {
    className?: string;
    onLogin: (wallet: IWalletListItem) => void;
}

class BlackWalletSelect extends BlackSelect<IWalletListItem> {}

type TAction = 'select-wallet' | 'create-new' | 'enter-password' | 'import-wallet';

interface IRefs {
    loginBtn: Button | null;
}

export class Login extends React.Component<IProps, any> {
    protected nodes: IRefs = {
        loginBtn: null,
    };

    protected static networkTypeOptions = ['live', 'rinkeby']

    public state = {
        currentAction: ('select-wallet' as TAction),
        password: '',
        newName: '',
        newPassword: '',
        confirmation: '',
        listOfWallets: ([] as IWalletListItem[]),
        name: '',
        pending: false,
        error: '',
        network: Login.networkTypeOptions[0],

        validation: ({} as IValidation),
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

        const update: any = {
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

    protected handleRequireNewWallet = () => {
        this.setState({ creating: true });
    }

    protected handleStartLogin = (event: any) => {
        event.preventDefault();

        this.setState({
            currentAction: 'enter-password',
        });
    }

    protected handleStartCreateNew = (event: any) => {
        event.preventDefault();

        this.setState({
            currentAction: 'create-new',
        });
    }

    protected handleStartImport = (event: any) => {
        event.preventDefault();

        this.setState({
            currentAction: 'import-wallet',
        });
    }

    protected findWalletByName(name: string) {
        const wallet = this.state.listOfWallets.find(x => x.name === this.state.name);

        if (wallet === undefined) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }

    protected handleLogin = async (event: any) => {
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

    protected handleCreateNew = async (event: any) => {
        event.preventDefault();

        let invalid = false;

        if (this.state.newName.length < 1 || this.state.newName.length > 20) {
            this.setState({ validation: { newName: getMessageText('wallet_name_length') } });
            invalid = true;
        }

        if (this.state.newPassword.length < 1) {
            this.setState({ validation: { newPassword: getMessageText('password_required') } });
            invalid = true;
        }

        const foundByName = this.state.listOfWallets.find(x => x.name === this.state.newName)
        if (foundByName) {
            this.setState({ validation: { newName: getMessageText('wallet_allready_exists') } });
            invalid = true;
        }

        if (this.state.newPassword !== this.state.confirmation) {
            this.setState({ validation: { confirmation: getMessageText('password_not_match') } });
            invalid = true;
        }

        if (!invalid) {
            this.setState({
                pending: true,
            });

            try {
                const { validation, data: walletListItem } = await Api.createWallet(
                    this.state.newPassword,
                    this.state.newName,
                    this.state.network,
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
                >
                    Login
                </Button>
            </form>
        );
    }

    protected handleOpenTextFile() {
        debugger;
    }

    protected renderImportWallet() {
        if (this.state.currentAction !== 'import-wallet') {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <form className="sonm-login__popup-content" onSubmit={this.handleLogin}>
                    <h3 className="sonm-login__popup-header">Import wallet</h3>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">File</span>
                        <span className="sonm-login__label-error">{this.state.validation.walletFile}</span>
                        <Upload
                            onOpenTextFile={this.handleOpenTextFile}
                            className="sonm-login__upload"
                            buttonProps={{
                                square: true,
                                height: 40,
                                transparent: true,
                            }}
                        >
                            Select file
                        </Upload>
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Name</span>
                        <span className="sonm-login__label-error">{this.state.validation.name}</span>
                        <input
                            autoComplete="off"
                            ref={setFocus}
                            type="name"
                            className="sonm-login__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </label>
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
                        className="sonm-login__import"
                        type="submit"
                    >
                        Import
                    </Button>
                </form>
            </Dialog>
        );
    }

    protected renderLoginPopup() {
        if (this.state.currentAction !== 'enter-password') {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <form className="sonm-login__popup-content" onSubmit={this.handleLogin}>
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

    protected renderNewWalletPopup() {
        if (this.state.currentAction !== 'create-new') {
            return null;
        }

        return (
            <Dialog onClickCross={this.handleReturn} color="dark">
                <form className="sonm-login__popup-content" onSubmit={this.handleCreateNew}>
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
                        <span className="sonm-login__label-text">Password confirmation</span>
                        <span className="sonm-login__label-error">{this.state.validation.confirmation}</span>
                        <input
                            autoComplete="off"
                            type="password"
                            className="sonm-login__input"
                            name="confirmation"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Network</span>
                        <BlackSelect
                            value={this.state.network}
                            name="network"
                            className="sonm-login__network-type"
                            onChange={this.handleChangeSelect}
                            options={Login.networkTypeOptions}
                        />
                    </label>
                    <Button
                        className="sonm-login__create"
                        type="submit"
                    >
                        Add wallet
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
                        <button type="button" className="sonm-login__add-wallet" onClick={this.handleStartCreateNew}>
                            Create wallet
                        </button>
                        <button type="button" className="sonm-login__add-wallet" onClick={this.handleStartImport}>
                            Import wallet
                        </button>
                    </div>
                    {this.renderNewWalletPopup()}
                    {this.renderLoginPopup()}
                    {this.renderImportWallet()}
                </div>
            </LoadMask>
        );
    }
}
