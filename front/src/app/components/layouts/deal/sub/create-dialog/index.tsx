import * as React from 'react';
import { Dialog } from 'app/components/common/dialog';
import { Input } from 'app/components/common/input';
import {
    Form,
    FormRow,
    FormField,
    FormHeader,
    FormButtons,
} from 'app/components/common/form';
import { Button } from 'app/components/common/button';
import { IChangeParams } from 'app/components/common/types';

export interface IProps {
    className?: string;
    onClose: () => void;
    onSubmit: () => void;
    validationPassword: string;
    validationPrice: string;
    newPrice: string;
    newDuration: string;
    password: string;
    onChangeInput: (params: IChangeParams<string>) => void;
    showDuration: boolean;
}

export class ChangeRequestDialog extends React.Component<IProps, any> {
    protected handleSubmit = async (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();
        this.props.onSubmit();
    };

    public render() {
        return (
            <Dialog
                onClickCross={this.props.onClose}
                className="sonm-change-request-create__dialog"
            >
                <Form
                    onSubmit={this.handleSubmit}
                    className="sonm-change-request-create__row"
                >
                    <FormHeader>Change Request</FormHeader>
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Price, USD/h"
                            error={this.props.validationPrice}
                        >
                            <Input
                                name="newPrice"
                                autoFocus
                                value={this.props.newPrice}
                                onChange={this.props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    {this.props.showDuration ? (
                        <FormRow>
                            <FormField fullWidth label="Duration, h">
                                <Input
                                    name="newDuration"
                                    value={this.props.newDuration}
                                    onChange={this.props.onChangeInput}
                                />
                            </FormField>
                        </FormRow>
                    ) : null}
                    <FormRow>
                        <FormField
                            fullWidth
                            label="Password"
                            error={this.props.validationPassword}
                        >
                            <Input
                                name="password"
                                type="password"
                                value={this.props.password}
                                onChange={this.props.onChangeInput}
                            />
                        </FormField>
                    </FormRow>
                    <FormButtons key="b">
                        <Button type="submit">Make Request</Button>
                    </FormButtons>
                </Form>
            </Dialog>
        );
    }
}

export default ChangeRequestDialog;
