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

export interface IProps {
    onClickCross: () => void;
    onSubmit: (event: any) => void;
    onChangeInput: (params: any) => void;
    validationName: string;
    validationPassword: string;
    validationConfirmation: string;
    validationPrivateKey: string;
    getMessageText: (...args: any[]) => string;
}

export class CreateAccountView extends React.PureComponent<IProps, any> {
    public render() {
        const props = this.props;
        const l = props.getMessageText;

        return (
            <Dialog onClickCross={props.onClickCross}>
                <Form
                    className="sonm-accounts-create-account__form"
                    onSubmit={props.onSubmit}
                >
                    <h3>New account</h3>
                    <FormRow>
                        <FormField
                            fullWidth
                            label={l('Account name')}
                            error={props.validationName}
                        >
                            <Input
                                type="text"
                                name="name"
                                onChange={props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label={l('Password')}
                            error={props.validationPassword}
                        >
                            <Input
                                type="password"
                                name="password"
                                onChange={props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label={l('Password confirmation')}
                            error={props.validationConfirmation}
                        >
                            <Input
                                type="password"
                                name="confirmation"
                                onChange={props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField
                            fullWidth
                            label={l('Private key (optional)')}
                            error={props.validationPrivateKey}
                        >
                            <Input
                                type="text"
                                name="privateKey"
                                onChange={props.onChangeInput}
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

export default CreateAccountView;
