import * as React from 'react';
import * as cn from 'classnames';
import { Dialog } from 'app/components/common/dialog';
import { Button } from 'app/components/common/button';
import { Input } from 'app/components/common/input';
import { Form, FormRow, FormField, FormHeader, FormButtons } from 'app/components/common/form';
import { MainStore } from 'app/stores/main';
import { getMessageText } from 'app/api/error-messages';
import { Hash } from 'app/components/common/hash-view';

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
        const when = this.state.privateKey === '' ? 'before' : 'after';

        return (
            <Dialog
                onClickCross={this.props.onClose}
                className={`sonm-show-key__dialog sonm-show-key__dialog--${when}`}
            >
                <Form onSubmit={this.handleSubmit} className="sonm-show-key__form">
                    <FormHeader>
                        {when === 'before'
                            ? 'Show private key'
                            : 'Private key'
                        }
                    </FormHeader>
                    {when === 'before'
                        ? <FormRow key="before">
                            <FormField
                                fullWidth
                                label="Password"
                                error={this.state.validationPassword}
                            >
                                <Input
                                    autoFocus
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChangePassword}
                                />
                            </FormField>
                        </FormRow> : null}
                    {when === 'after' ?
                        <Hash
                            hash={this.state.privateKey}
                            keepHashString
                            hasCopyButton
                            className={cn(
                                'sonm-show-key__hash', {
                                'sonm-show-key__hash--visible': when === 'after',
                            })}
                        /> : null }
                    <FormButtons key="b">
                        <Button
                            onClick={when === 'after' ? this.props.onClose : undefined}
                            type={when === 'after' ? 'button' : 'submit'}
                        >
                            {when === 'before' ? 'Show' : 'Close'}
                        </Button>
                    </FormButtons>
                </Form>
            </Dialog>
        );
    }
}

export default ShowPassword;
