import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { IValidation } from 'ipc/types';

export interface ICreateAccountForm {
    password: string;
    name: string;
}

export interface IProps {
    className?: string;
    validation?: IValidation;
    onSubmit: (data: ICreateAccountForm) => void;
    onClickCross: () => void;
}

export class CreateAccount extends React.Component<IProps, any> {
    public state = {
        name: '',
        password: '',
        confirmation: '',
        validation: {} as IValidation,
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const validation = { ...this.state.validation };

        if (!this.state.name) {
            validation.name = 'Name is required';
        }

        if (this.state.password.length < 8) {
            validation.password = 'Password must be at least 8 character';
        }

        if (this.state.password.length < 1) {
            validation.password = 'Password is required';
        }

        if (this.state.password !== this.state.confirmation) {
            validation.confirmation = 'Password not matched';
        }

        if (Object.keys(validation).every(x => !validation[x])) {
            this.setState({ validation: {} });

            this.props.onSubmit({
                password: this.state.password,
                name: this.state.name,
            });

        } else {
            this.setState({ validation });
        }
    }

    public componentWillReceiveProps(next: IProps) {
        const validation = { ...next.validation, ...this.state.validation };

        this.setState({ validation });
    }

    protected handleClickCross = () => {
        this.props.onClickCross();
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
            validation: {
                ...this.state.validation,
                [event.target.name]: '',
            },
        });
    }

    public render() {
        return (
            <Dialog onClickCross={this.handleClickCross}>
                <form className="sonm-wallets-add-account__content" onSubmit={this.handleSubmit}>
                    <h3 className="sonm-wallets-add-account__header">New account</h3>
                    <label className="sonm-wallets-add-account__label">
                        <span className="sonm-wallets-add-account__label-text">Password</span>
                        <span className="sonm-wallets-add-account__label-error">{this.state.validation.password}</span>
                        <input
                            type="password"
                            className="sonm-wallets-add-account__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-wallets-add-account__label">
                        <span className="sonm-wallets-add-account__label-text">Password confirmation</span>
                        <span className="sonm-wallets-add-account__label-error">{this.state.validation.confirmation}</span>
                        <input
                            type="password"
                            className="sonm-wallets-add-account__input"
                            name="confirmation"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-wallets-add-account__label">
                        <span className="sonm-wallets-add-account__label-text">Enter account name</span>
                        <span className="sonm-wallets-add-account__label-error">{this.state.validation.name}</span>
                        <input
                            type="text"
                            className="sonm-wallets-add-account__input"
                            name="name"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <Button
                        className="sonm-wallets-add-account__submit"
                        type="submit"
                    >
                        Create
                    </Button>
                </form>
            </Dialog>
        );
    }
}

export default CreateAccount;
