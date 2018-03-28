import * as React from 'react';
import { IValidation } from 'ipc/types';
import { rootStore } from 'app/stores';
import { validateHex } from 'app/utils/validation/validate-ether-address';
import { CreateAccountView } from './view';

export interface ICreateAccountForm {
    password: string;
    confirmation: string;
    name: string;
    privateKey: string;
}

export interface IProps {
    serverValidation: IValidation;
    onSubmit: (data: ICreateAccountForm) => void;
    onClickCross: () => void;
}

const emptyForm: ICreateAccountForm = {
    password: '',
    confirmation: '',
    name: '',
    privateKey: '',
};

export class CreateAccount extends React.Component<IProps, any> {
    public state = {
        form: emptyForm,
        validation: emptyForm,
        dirty: {},
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const l = rootStore.localizator.getMessageText;
        const validation = {} as any;
        const form = this.state.form;

        if (!form.name) {
            validation.name = l('name_required');
        }

        if (!form.password) {
            validation.password = l('password_required');
        } else if (form.password.length < 8) {
            validation.password = l('password_length');
        }

        if (form.password !== form.confirmation) {
            validation.confirmation = l('password_not_match');
        }

        if (form.privateKey !== '') {
            const validationPrivateKey = validateHex(64, form.privateKey);
            if (validationPrivateKey.length) {
                validation.privateKey = validationPrivateKey.map(l).join(' ');
            }
        }

        if (Object.keys(validation).every(x => '' === validation[x])) {
            this.setState({
                dirty: {},
                validation: emptyForm,
            });

            this.props.onSubmit(form);
        } else {
            this.setState({ validation });
        }
    };

    protected handleClickCross = () => {
        this.props.onClickCross();
    };

    protected handleChangeInput = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            form: {
                ...this.state.form,
                [name]: value,
            },
            validation: {
                ...this.state.validation,
                [name]: '',
            },
            dirty: {
                ...this.state.dirty,
                [name]: true,
            },
        });
    };

    protected getValidation(fieldName: keyof ICreateAccountForm) {
        return Boolean((this.state.dirty as any)[fieldName])
            ? ''
            : this.props.serverValidation[fieldName] ||
                  this.state.validation[fieldName];
    }

    public render() {
        return (
            <CreateAccountView
                onClickCross={this.handleClickCross}
                onSubmit={this.handleSubmit}
                onChangeInput={this.handleChangeInput}
                validationConfirmation={this.getValidation('confirmation')}
                validationName={this.getValidation('name')}
                validationPassword={this.getValidation('password')}
                validationPrivateKey={this.getValidation('privateKey')}
                getMessageText={rootStore.localizator.getMessageText}
            />
        );
    }
}

export default CreateAccount;
