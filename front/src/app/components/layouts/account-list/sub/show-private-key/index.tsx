import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { Input } from 'app/components/common/input';
import { Form, FormRow, FormField, FormHeader, FormButtons } from 'app/components/common/form';
import { MainStore } from 'app/stores/main';
import { getMessageText } from '../../../../../api/error-messages';

export interface IProps {
    address: string;
    className?: string;
    onClose: () => void;
    mainStore: MainStore;
}

export class ShowPassword extends React.Component<IProps, any> {
    public state = {
        password: '',
        privateKey: '',
        validationPassword: '',
    }

    protected handleSubmit = async (event: any) => {
        event.preventDefault();

        const privateKey = await this.props.mainStore.getPrivateKey(
            this.state.password,
            this.props.address,
        );

        if (privateKey) {
            this.setState({
                validationPassword: '',
                privateKey,
            });
        } else {
            this.setState({
                validationPassword: getMessageText('incorrect_password'),
                privateKey: '',
            });
        }
    }

    protected handleChangePassword = (event: any) => {
        this.setState({ password: event.target.value });
    }

    public render() {

        return (
            <Dialog onClickCross={this.props.onClose}>
                <Form onSubmit={this.handleSubmit} className="sonm-show-key__form">
                    <FormHeader>Show private key</FormHeader>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Password"
                            error={this.state.validationPassword}
                        >
                            <Input type="password" value={this.state.password} onChange={this.handleChangePassword}/>
                        </FormField>
                    </FormRow>
                    <FormRow>
                        <FormField label="Private key">
                            <div className="sonm-show-key__key">
                                {this.state.privateKey ? this.state.privateKey : '?'}
                            </div>
                        </FormField>
                    </FormRow>
                    <FormButtons>
                        <Button
                            className=""
                            type="submit"
                        >
                            Show
                        </Button>
                    </FormButtons>
                </Form>
            </Dialog>
        );
    }
}

export default ShowPassword;
