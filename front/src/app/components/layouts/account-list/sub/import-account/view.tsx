import * as React from 'react';
import { Upload, IFileOpenResult } from 'app/components/common/upload';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { Hash } from 'app/components/common/hash-view';
import { IdentIcon } from 'app/components/common/ident-icon/index';
import { Input } from 'app/components/common/input/index';
import {
    FormField,
    FormRow,
    Form,
    FormButtons,
} from 'app/components/common/form';

export interface IAddAccountForm {
    json: string;
    password: string;
    name: string;
}

export interface IProps {
    address: string;
    validationJson: string;
    validationName: string;
    validationPassword: string;
    fileHasBeenUplodedText: string;
    onSubmit: (event: any) => void;
    onClickCross: () => void;
    existingAccounts: string[];
    onChangeInput: (params: any) => void;
    onOpenTextFile: (params: IFileOpenResult) => void;
}

export class ImportAccountView extends React.PureComponent<IProps, never> {
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

    protected handleOpenTextFile = (event: any) => {
        const isCompleted = this.props.onOpenTextFile(event);

        if (isCompleted && this.nodes.name) {
            this.nodes.name.focus();
        }
    };

    public render() {
        const props = this.props;

        return (
            <Dialog
                onClickCross={props.onClickCross}
                height={props.address === '' ? 440 : 550}
            >
                <Form
                    className="sonm-accounts-add-account__form"
                    onSubmit={props.onSubmit}
                >
                    <h3>Add account</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label=""
                            error={props.validationJson}
                            success={props.fileHasBeenUplodedText}
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
                            error={props.validationName}
                        >
                            <Input
                                ref={this.saveNameInputNode}
                                type="text"
                                name="name"
                                onChangeDeprecated={props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Account password"
                            error={props.validationPassword}
                        >
                            <Input
                                type="password"
                                name="password"
                                onChangeDeprecated={props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button type="submit" height={40}>
                            Add
                        </Button>
                    </FormButtons>
                    {props.address === '' ? null : (
                        <FormRow>
                            <FormField fullWidth>
                                <div className="sonm-accounts-add-account__preview-ct">
                                    <IdentIcon
                                        className="sonm-accounts-add-account__preview-icon"
                                        address={props.address}
                                    />
                                    <Hash
                                        className="sonm-accounts-add-account__preview-address"
                                        hash={props.address}
                                    />
                                </div>
                            </FormField>
                        </FormRow>
                    )}
                </Form>
            </Dialog>
        );
    }
}

export default ImportAccountView;
