import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import {
    FormField,
    FormRow,
    Form,
    FormButtons,
} from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IValidation } from 'ipc/types';
import { rootStore } from 'app/stores';
import { validateHex } from 'app/utils/validation/validate-ether-address';

export interface ICreateAccountForm {
    password: string;
    name: string;
    privateKey: string;
}

export interface IProps {
    serverValidation: IValidation;
    onSubmit: (data: ICreateAccountForm) => void;
    onClickCross: () => void;
}

export class CreateAccount extends React.Component<IProps, any> {
    public state = {
        name: '',
        password: '',
        confirmation: '',
        privateKey: '',
        validation: {} as IValidation,
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const l = rootStore.localizator.getMessageText;
        const validation = { ...this.state.validation };

        if (!this.state.name) {
            validation.name = l('name_required');
        }

        if (!this.state.password) {
            validation.password = l('password_required');
        } else if (this.state.password.length < 8) {
            validation.password = l('password_length');
        }

        if (this.state.password !== this.state.confirmation) {
            validation.confirmation = l('password_not_match');
        }

        const validationPrivateKey = validateHex(64, this.state.privateKey);
        if (validationPrivateKey.length) {
            validation.privateKey = validationPrivateKey.map(l).join(' ');
        }

        if (Object.keys(validation).every(x => !validation[x])) {
            this.setState({ validation: {} });

            this.props.onSubmit({
                password: this.state.password,
                name: this.state.name,
                privateKey: this.state.privateKey,
            });
        } else {
            this.setState({ validation });
        }
    };

    public componentWillReceiveProps(next: IProps) {
        const validation = { ...this.state.validation };

        const sv = next.serverValidation;
        Object.keys(sv).reduce((key: string, acc: any) => {
            if (sv[key]) {
                acc[key] = sv[key];
            }

            return acc;
        }, validation);

        this.setState({ validation });
    }

    protected handleClickCross = () => {
        this.props.onClickCross();
    };

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
            validation: {
                ...this.state.validation,
                [event.target.name]: '',
            },
        });
    };

    public render() {
        const l = rootStore.localizator.getMessageText;

        return (
            <Dialog onClickCross={this.handleClickCross}>
                <Form
                    className="sonm-accounts-create-account__form"
                    onSubmit={this.handleSubmit}
                >
                    <h3>New account</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label={l('Account name')}
                            error={this.state.validation.name}
                        >
                            <Input
                                type="text"
                                name="name"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label={l('Password')}
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
                            label={l('Password confirmation')}
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
                            label={l('Private key (optional)')}
                            error={this.state.validation.privateKey}
                        >
                            <Input
                                type="text"
                                name="privateKey"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button type="submit">{l('Create')}</Button>
                    </FormButtons>
                </Form>
            </Dialog>
        );
    }
}

export default CreateAccount;
