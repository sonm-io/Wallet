import * as React from 'react';
import { Upload, IFileOpenResult } from 'app/components/common/upload';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { IValidation } from 'ipc/types';

export interface IAddAccountValidation extends IValidation {
    newPassword: string;
    newName: string;
}

export interface IProps {
    className?: string;
    validation?: IAddAccountValidation;
    onSubmit: (state: any) => void;
    onClickCross: () => void;
}

export class AddAccount extends React.PureComponent<IProps, any> {
    public state = {
        name: '',
        password: '',
        json: '',
        fileError: '',
        fileSuccess: '',
        address: '',
    };

    protected handleSubmit = (event: any) => {
        event.preventDefault();

        this.props.onSubmit({
            json: this.state.json,
            password: this.state.password,
            name: this.state.name,
        });
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
            update.json = json;
            update.fileError = '';
            update.fileSuccess = `File ${params.fileName} has been selected`;

        } catch (e) {
            update.fileSuccess = '';
            update.fileError = e.message || 'Incorrect file';
        }

        this.setState(update);
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    public render() {
        const hasErrors = Boolean(this.state.fileError || (this.props.validation && this.props.validation.file));

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
                            hasErrors
                                ? (
                                    <span className="sonm-wallets-add-account__label-error">
                                        {this.state.fileError} {this.props.validation && this.props.validation.file}
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
                            {this.props.validation && this.props.validation.newPassword}
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
                            {this.props.validation && this.props.validation.newName}
                        </span>
                        <input
                            type="text"
                            className="sonm-wallets-add-account__input"
                            name="name"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <Button
                        disabled={this.state.fileError !== ''}
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
