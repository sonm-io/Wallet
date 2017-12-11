import * as React from 'react';
import { Upload, IFileOpenResult } from 'app/components/common/upload';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { IValidation } from 'ipc/types';

export interface IAddAccountForm {
    json: string;
    password: string;
    name: string;
}

export interface IProps {
    className?: string;
    validation?: IValidation;
    onSubmit: (data: IAddAccountForm) => void;
    onClickCross: () => void;
    existingAccounts: string[];
}

export class AddAccount extends React.PureComponent<IProps, any> {
    public state = {
        name: '',
        password: '',
        json: '',
        fileSuccess: '',
        address: '',
        validation: {} as IValidation,
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        const validation = {} as IValidation;

        if (!this.state.password) {
            validation.password = 'Password is required';
        }

        if (!this.state.name) {
            validation.name = 'Name is required';
        }

        if (!this.state.json) {
            validation.json = 'Please select file';
        }

        if (this.props.existingAccounts.indexOf(this.state.address) !== -1) {
            validation.json = 'Account already exists';
        }

        if (Object.keys(validation).every(x => !validation[x])) {
            this.setState({ validation: {} });
            this.props.onSubmit({
                json: this.state.json,
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

    protected handleOpenTextFile = (params: IFileOpenResult) => {
        const update = {} as any;

        try {
            if (params.error) { throw new Error(params.error); }

            const lowerCase = params.text && params.text.toLowerCase();
            const json = JSON.parse(lowerCase as any);

            const address = json.address;

            if (!address) { throw new Error('Incorrect file: no address'); }

            update.address = address;
            update.json = lowerCase;
            update.fileSuccess = `File ${params.fileName} has been selected`;
            update.validation = { ...this.state.validation, json: '' };

        } catch (e) {
            update.fileSuccess = '';
            update.validation = {
                json: e.message || 'Incorrect file',
            };
        }

        this.setState(update);
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
        const validation: IValidation = this.state.validation;
        const hasFileError = validation.json;

        return (
            <Dialog onClickCross={this.handleClickCross}>
                <form className="sonm-wallets-add-account__content" onSubmit={this.handleSubmit}>
                    <label className="sonm-wallets-add-account__label sonm-wallets-add-account__add-file">
                        <h3 className="sonm-wallets-add-account__header">Add account</h3>
                        <Upload
                            onOpenTextFile={this.handleOpenTextFile}
                            className="sonm-wallets-add-account__upload"
                            buttonProps={{square: true, height: 40, transparent: true}}
                        >
                            Select wallet file
                        </Upload>
                        {
                            hasFileError
                                ? (
                                    <span className="sonm-wallets-add-account__label-error">
                                        {validation.json}
                                    </span>
                                )
                                : (
                                    <span className="sonm-wallets-add-account__label-success">
                                        {this.state.fileSuccess}
                                    </span>
                                )
                        }
                    </label>
                    <label className="sonm-wallets-add-account__label">
                        <span className="sonm-wallets-add-account__label-text">Enter account password</span>
                        <span className="sonm-wallets-add-account__label-error">
                            {validation.password}
                        </span>
                        <input
                            type="password"
                            className="sonm-wallets-add-account__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-wallets-add-account__label">
                        <span className="sonm-wallets-add-account__label-text">Enter account name</span>
                        <span className="sonm-wallets-add-account__label-error">
                            {validation.name}
                        </span>
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
                        square
                        transparent
                        height={40}
                    >
                        Create
                    </Button>
                </form>
            </Dialog>
        );
    }
}

export default AddAccount;
