import * as React from 'react';
import { IValidation } from 'ipc/types';
import { RootStore } from 'app/stores';
import { validateHex } from 'app/utils/validation/validate-ether-address';
import { CreateAccountView } from './view';
import { IHasRootStore, injectRootStore } from 'app/components/layouts/layout';

export interface ICreateAccountForm {
    password: string;
    confirmation: string;
    name: string;
    privateKey: string;
}

export interface IProps extends IHasRootStore {
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

const emptyObject = {};

@injectRootStore
export class CreateAccount extends React.Component<IProps, any> {
    // ToDo make stateless

    protected get rootStore() {
        return this.props.rootStore as RootStore;
    }

    public state = {
        form: emptyForm,
        validation: emptyObject as any,
        dirty: emptyObject as any,
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const l = this.rootStore.localizator.getMessageText;
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

        this.setState({ dirty: emptyObject });

        if (Object.keys(validation).length === 0) {
            this.setState({ validation });

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

    protected getValidation(fieldName: keyof ICreateAccountForm): string {
        const hasLocalValidation =
            Object.keys(this.state.validation).length !== 0;
        const hasBeenChanged = (this.state.dirty as any)[fieldName];

        return hasBeenChanged
            ? ''
            : (hasLocalValidation
                  ? this.state.validation[fieldName]
                  : this.props.serverValidation[fieldName]) || '';
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
                getMessageText={this.rootStore.localizator.getMessageText}
            />
        );
    }
}

export default CreateAccount;
