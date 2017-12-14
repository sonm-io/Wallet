import * as React from 'react';
import * as cn from 'classnames';
import { Button } from 'app/components/common/button';
import { Api } from 'app/api';
import { IValidation } from 'ipc/types';
import { BlackSelect } from 'app/components/common/black-select';
import { Dialog } from 'app/components/common/dialog';
import { LoadMask } from 'app/components/common/load-mask';
import { setFocus } from 'app/components/common/utils/setFocus';

interface IProps {
    className?: string;
    onLogin: () => void;
}

class BlackWalletSelect extends BlackSelect<string> {}

type TAction = 'select-wallet' | 'create-new' | 'enter-password';

interface IRefs {
    loginBtn: Button | null;
}

export class Login extends React.Component<IProps, any> {
    protected nodes: IRefs = {
        loginBtn: null,
    };

    public state = {
        currentAction: ('select-wallet' as TAction),
        password: '',
        newName: '',
        newPassword: '',
        confirmation: '',
        wallets: ([] as string[]),
        name: '',
        pending: false,
        error: '',

        validation: ({} as IValidation),
    };

    protected getWalletList = async () =>  {
        this.setState({ pending: true });

        const { data } = await Api.getWalletList();
        const wallets = data as string[];

        let name = '';
        const savedName = window.localStorage.getItem('sonm-last-used-wallet');

        if (savedName && wallets.indexOf(savedName) !== -1) {
            name = savedName;
        } else if (wallets.length > 0) {
            name = wallets[0];
        }

        const update: any = {
            pending: false,
            wallets,
            name,
        };

        if (wallets.length === 1) {
            update.name = wallets[0];
            update.currentAction = 'enter-password';
        }

        if (wallets.length === 0) {
            update.currentAction = 'create-new';
        }

        this.setState(update);
    }

    protected async fastLogin() {
        if (window.localStorage.getItem('sonm-4ever')) {
            const { data } = await Api.setSecretKey('1', '1');
            if (data) {
                this.props.onLogin();
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

    protected handleLogin = async (event: any) => {
        event.preventDefault();

        this.setState({ pending: true });

        try {
            const { validation, data: success } = await Api.setSecretKey(this.state.password, this.state.name);

            if (validation) {
                this.setState({ validation });
            }

            if (success) {
                this.props.onLogin();
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
            this.setState({ validation: { newName: 'Name length must be in range 1..20' } });
            invalid = true;
        }

        if (this.state.newPassword.length < 1) {
            this.setState({ validation: { newPassword: 'Password is required' } });
            invalid = true;
        }

        if (this.state.wallets.indexOf(this.state.newName) !== -1) {
            this.setState({ validation: { newName: 'Already exist' } });
            invalid = true;
        }

        if (this.state.newPassword !== this.state.confirmation) {
            this.setState({ validation: { confirmation: 'Passwords !==' } });
            invalid = true;
        }

        if (!invalid) {
            this.setState({
                pending: true,
            });

            try {
                const { validation } = await Api.setSecretKey(this.state.newPassword, this.state.newName);

                if (validation) {
                    this.setState({ validation });
                } else {
                    window.localStorage.setItem('sonm-last-used-wallet', this.state.newName);
                    this.props.onLogin();
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

    protected renderSelect() {
        return (
            <form className="sonm-login__wallet-form" onSubmit={this.handleStartLogin}>
                <BlackWalletSelect
                    className="sonm-login__wallet-select"
                    name="name"
                    onChange={this.handleChangeWallet}
                    value={this.state.name}
                    options={this.state.wallets}
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
                            type="password"
                            className="sonm-login__input"
                            name="confirmation"
                            onChange={this.handleChangeInput}
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
                            Add wallet
                        </button>
                    </div>
                    {this.renderNewWalletPopup()}
                    {this.renderLoginPopup()}
                </div>
            </LoadMask>
        );
    }
}
