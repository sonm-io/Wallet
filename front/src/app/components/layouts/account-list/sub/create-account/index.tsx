import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { FormField, FormRow, Form } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IValidation } from 'ipc/types';
import { getMessageText } from 'app/api/error-messages';

export interface ICreateAccountForm {
    password: string;
    name: string;
}

export interface IProps {
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
            validation.name = getMessageText('name_required');
        }

        if (!this.state.password) {
            validation.password = getMessageText('password_required');
        } else if (this.state.password.length < 8) {
            validation.password = getMessageText('password_length');
        }

        if (this.state.password !== this.state.confirmation) {
            validation.confirmation = getMessageText('password_not_match');
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
                <Form className="sonm-accounts-create-account__form" onSubmit={this.handleSubmit}>
                    <h3>New account</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Password"
                            error={this.state.validation.password}
                        >
                            <Input
                                type="password"
                                name="password"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Password confirmation"
                            error={this.state.validation.confirmation}
                        >
                            <Input
                                type="password"
                                name="confirmation"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Account name"
                            error={this.state.validation.name}
                        >
                            <Input
                                type="text"
                                name="name"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <Button
                        type="submit"
                    >
                        Create
                    </Button>
                </Form>
            </Dialog>
        );
    }
}

export default CreateAccount;
