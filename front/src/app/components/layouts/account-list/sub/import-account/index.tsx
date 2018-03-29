import * as React from 'react';
import { IFileOpenResult } from 'app/components/common/upload';
import { shortString } from 'app/utils/short-string';
import { rootStore } from 'app/stores';
import { ImportAccountView } from './view';

export interface IImportAccountForm {
    json: string;
    password: string;
    name: string;
}

export interface IProps {
    className?: string;
    serverValidation: IImportAccountForm;
    onSubmit: (data: IImportAccountForm) => void;
    onClickCross: () => void;
    existingAccounts: string[];
}

const emptyForm: IImportAccountForm = {
    json: '',
    password: '',
    name: '',
};

const emptyObject: any = {};

export class ImportAccount extends React.Component<IProps, any> {
    public state = {
        fileSuccess: '',
        address: '',
        form: emptyForm,
        validation: emptyObject,
        dirty: emptyObject,
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const validation = {} as any;
        const form = this.state.form;
        const l = rootStore.localizator.getMessageText;

        if (!form.password) {
            validation.password = l('password_required');
        }

        if (!form.name) {
            validation.name = l('name_required');
        }

        if (!form.json) {
            validation.json = l('select_file');
        } else if (
            this.props.existingAccounts.indexOf(this.state.address) !== -1
        ) {
            validation.json = l('account_already_exists');
        }

        this.setState({
            dirty: emptyObject,
            validation,
        });

        if (Object.keys(validation).length === 0) {
            this.props.onSubmit({
                json: form.json,
                password: form.password,
                name: form.name,
            });
        }
    };

    protected handleClickCross = () => {
        this.props.onClickCross();
    };

    protected nodes: any = {};

    protected saveInputNode(
        name: string,
        ref: HTMLInputElement | HTMLButtonElement | null,
    ) {
        if (ref && this.nodes[name] !== ref) {
            this.nodes[name] = ref;
        }
    }

    protected saveNameInputNode = this.saveInputNode.bind(this, 'name');

    protected saveUploadInputNode = this.saveInputNode.bind(this, 'upload');

    protected handleOpenTextFile = (params: IFileOpenResult): boolean => {
        const update = {} as any;
        let isCompleted;

        try {
            if (params.error) {
                throw new Error(params.error);
            }

            const lowerCase = String(params.text && params.text).toLowerCase();
            const json = JSON.parse(lowerCase);

            const address = json.address;

            if (!address) {
                throw new Error('no_addres_in_account_file');
            }

            update.address = address.startsWith('0x')
                ? address
                : `0x${address}`;

            update.fileSuccess = params.fileName;

            update.form = {
                ...this.state.form,
                json: lowerCase,
            };
            update.validation = {
                ...this.state.validation,
                json: '',
            };
            update.dirty = {
                ...this.state.dirty,
                json: true,
            };

            isCompleted = true;
        } catch (e) {
            update.fileSuccess = '';
            update.address = '';
            update.validation = {
                ...this.state.validation,
                json: e.message || 'incorrect_file',
            };

            isCompleted = false;
        }

        this.setState(update);

        return isCompleted;
    };

    protected handleChangeInput = (event: any) => {
        const name = event.target.name;

        this.setState({
            form: {
                ...this.state.form,
                [name]: event.target.value,
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

    protected getValidation(fieldName: keyof IImportAccountForm): string {
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
        const state = this.state;

        return (
            <ImportAccountView
                address={state.address}
                onClickCross={this.handleClickCross}
                validationJson={this.getValidation('json')}
                validationName={this.getValidation('name')}
                validationPassword={this.getValidation('password')}
                fileHasBeenUplodedText={shortString(this.state.fileSuccess, 20)}
                existingAccounts={this.props.existingAccounts}
                onChangeInput={this.handleChangeInput}
                onOpenTextFile={this.handleOpenTextFile}
                onSubmit={this.handleSubmit}
            />
        );
    }
}

export default ImportAccount;
