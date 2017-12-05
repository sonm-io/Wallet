import * as React from 'react';
import { Spin } from 'antd';
import * as cn from 'classnames';
import { Button } from 'app/components/common/button';
import { Api } from 'app/api';
import { IValidation } from 'ipc/types';

interface IProps {
    className?: string;
    onLogin: () => void;
}

export class Login extends React.Component<IProps, any> {
    public state = {
        currentAction: 'start',
        password: 'my secret key',
        confirmation: '',
        wallets: [] as string[],
        name: '',
        pending: false,
        creating: false,
        error: '',

        validation: {} as IValidation,
    };

    protected getWalletList = async () =>  {
        this.setState({ pending: true });

        const { data: wallets } = await Api.getWalletList();

        this.setState({
            pending: false,
            wallets,
            name: wallets && wallets.length > 0
                ? wallets[0]
                : '',
        });
    }

    public componentWillMount() {
        this.getWalletList();
    }

    protected handleRequireNewWallet = () => {
        this.setState({ creating: true });
    }

    protected handleLogin = async () => {
        this.setState({
            pending: true,
        });

        try {
            const { validation } = await Api.setSecretKey(this.state.password, this.state.name);

            if (validation) {
                this.setState({
                    validation,
                });
            } else {
                this.props.onLogin();
            }
        } catch (e) {

            this.setState({
                pending: false,
                error: String(e),
            });
        }
    }

    protected handleCreateNew = async () => {
        if (this.state.wallets.indexOf(this.state.name) !== -1) {
            throw new Error(`This wallet name ${this.state.name} is already exists`);
        }

        if (this.state.password !== this.state.confirmation) {
            this.setState({
                validation: {
                    confirmation: 'Passwords !==',
                },
            });

            return;
        }

        this.setState({
            pending: true,
        });

        try {
            const { validation } = await Api.setSecretKey(this.state.password, this.state.name);

            if (validation) {
                this.setState({
                    validation,
                });
            } else {
                this.props.onLogin();
            }

        } catch (e) {

            this.setState({
                pending: false,
                error: String(e),
            });
        }
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    protected renderSelect(out: any[]) {
        out.push([
            <label key="s">
                Wallet name
                <select className="sonm-login__select-name" name="name" onChange={this.handleChangeInput} value={this.state.name}>
                    {this.state.wallets.map(name => <option key={name}>{name}</option>)}
                </select>
            </label>,
        ]);

        return out;
    }

    protected renderControls() {
        const out: any[] = [];

        if (this.state.creating || this.state.wallets.length === 0) {
            out.push(
                <label key="i-n-n">
                    Wallet name
                    <input type="name" className="sonm-login__new-name" name="name" onChange={this.handleChangeInput} />
                </label>,
                <label key="i-n-p">
                    Password
                    <input type="password" className="sonm-login__new-password" name="password"  onChange={this.handleChangeInput} />
                </label>,
                <label key="i-n-c">
                    Password confirmation
                    <input type="password" className="sonm-login__new-confirm" name="confirmation" onChange={this.handleChangeInput} />
                    <span>{this.state.validation.confirmation}</span>
                </label>,
                <Button key="b-c" className="sonm-login__create" onClick={this.handleCreateNew}>Create</Button>,
            );
        } else if (this.state.wallets.length) {
            if (this.state.wallets.length > 1) {
                this.renderSelect(out);
            }
            out.push(
                <label key="i-l">
                    Password
                    <input type="password" className="sonm-login__login-input" name="password" onChange={this.handleChangeInput} />
                    <span>{this.state.validation.password}</span>
                </label>,
                <Button key="b-u" className="sonm-login__login-btn" onClick={this.handleLogin}>Login</Button>,
                <Button key="b-n-w" className="sonm-login__new-btn" onClick={this.handleRequireNewWallet}>New Wallet</Button>,
            );
        }

        return out;
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={cn('sonm-login', className)}>
                <div className="sonm-login__errors">
                    {this.state.error}
                </div>
                <div className="sonm-login__center">
                    <div className="sonm-login__controls">
                        <Spin spinning={this.state.pending}>
                            {this.renderControls()}
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}
