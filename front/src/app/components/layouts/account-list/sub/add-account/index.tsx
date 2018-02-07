import * as React from 'react';
import { Upload, IFileOpenResult } from 'app/components/common/upload';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { Hash } from 'app/components/common/hash-view';
import { IValidation } from 'ipc/types';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { Input } from 'app/components/common/input/index';
import { getMessageText } from 'app/api/error-messages'; // TODO move to context
import { FormField, FormRow, Form, FormButtons } from 'app/components/common/form';
import { shortString } from 'app/utils/short-string';

// import { setFocus } from 'app/components/common/utils/setFocus';

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

interface IFocusable {
    focus: () => void;
}

interface IMapNameToFocusable {
    [name: string]: IFocusable | null;
}

export class AddAccount extends React.Component<IProps, any> {
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

        const validation = { ...this.state.validation };

        if (!this.state.password) {
            validation.password = getMessageText('password_required');
        }

        if (!this.state.name) {
            validation.name = getMessageText('name_required');
        }

        if (!this.state.json) {
            validation.json = getMessageText('select_file');
        } else if (this.props.existingAccounts.indexOf(this.state.address) !== -1) {
            validation.json = getMessageText('account_already_exists');
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

    public componentDidMount() {
        // this.nodes.upload.focus(); // TODO
    }

    public componentWillReceiveProps(next: IProps) {
        const validation = { ...next.validation, ...this.state.validation };

        this.setState({ validation });
    }

    protected handleClickCross = () => {
        this.props.onClickCross();
    }

    protected nodes: IMapNameToFocusable = {};

    protected saveNameInputNode = this.saveInputNode.bind(this, 'name');

    protected saveUploadInputNode = this.saveInputNode.bind(this, 'upload');

    protected saveInputNode(name: string, ref: HTMLInputElement | HTMLButtonElement | null) {
        if (ref && this.nodes[name] !== ref) {
            this.nodes[name] = ref;
        }
    }

    protected handleOpenTextFile = (params: IFileOpenResult) => {
        const update = {} as any;

        try {
            if (params.error) { throw new Error(params.error); }

            const lowerCase = params.text && params.text.toLowerCase();
            const json = JSON.parse(lowerCase as any);

            const address = json.address;

            if (!address) { throw new Error('Incorrect file: no address'); }

            update.address = address.startsWith('0x') ? address : `0x${address}`;
            update.json = lowerCase;
            update.fileSuccess = params.fileName;
            update.validation = { ...this.state.validation, json: '' };

            const nameInput = this.nodes.name;
            if (nameInput !== null) {
                nameInput.focus();
            }

        } catch (e) {
            update.fileSuccess = '';
            update.address = '';
            update.validation = {
                ...this.state.validation,
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

        return (
            <Dialog onClickCross={this.handleClickCross} height={this.state.address === '' ? 440 : 550}>
                <Form className="sonm-accounts-add-account__form" onSubmit={this.handleSubmit}>
                    <h3>Add account</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label=""
                            error={validation.json}
                            success={shortString(this.state.fileSuccess, 20)}
                        >
                            <Upload
                                onOpenTextFile={this.handleOpenTextFile}
                                className="sonm-accounts-add-account__upload"
                                buttonProps={{
                                    square: true,
                                    height: 40,
                                    transparent: true,
                                }}
                            >
                                Select keystore / JSON file
                            </Upload>
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Account name"
                            error={validation.name}
                        >
                            <Input
                                ref={this.saveNameInputNode}
                                type="text"
                                name="name"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Account password"
                            error={validation.password}
                        >
                            <Input
                                type="password"
                                name="password"
                                onChange={this.handleChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button
                            type="submit"
                            height={40}
                        >
                            Add
                        </Button>
                    </FormButtons>
                    {this.state.address === '' ? null :
                        <FormRow>
                            <FormField fullWidth>
                                <div className="sonm-accounts-add-account__preview-ct">
                                    <IdentIcon
                                        className="sonm-accounts-add-account__preview-icon"
                                        address={this.state.address}
                                    />
                                    <Hash
                                        className="sonm-accounts-add-account__preview-address"
                                        hash={this.state.address}
                                    />
                                </div>
                            </FormField>
                        </FormRow>
                    }
                </Form>
            </Dialog>
        );
    }
}

export default AddAccount;
