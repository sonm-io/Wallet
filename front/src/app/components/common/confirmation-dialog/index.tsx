import * as React from 'react';
import { Password } from 'app/components/common/password';
import { Button } from 'app/components/common/button';
import { Dialog } from 'app/components/common/dialog';
import { Form, FormRow, FormField } from 'app/components/common/form';
import { IChangeParams } from 'app/components/common/types';
import * as cn from 'classnames';

export interface IConfirmationDialogProps {
    validationMessage?: string;
    onSubmit: () => void;
    onClose: () => void;
    onCancel: () => void;
    onChangePassword: (params: IChangeParams<string>) => void;
    className?: string;
    password: string;
    submitDisabled: boolean;

    labelHeader?: string;
    labelSubheader?: string;
    labelDescription?: string;
    labelCancel?: string;
    labelSubmit?: string;

    children: any;
}

interface IState {
    password: string;
}

export class ConfirmationDialog extends React.Component<
    IConfirmationDialogProps,
    IState
> {
    public static defaultProps: Partial<IConfirmationDialogProps> = {
        labelHeader: 'Confirm operation',
        labelSubheader: '',
        labelCancel: 'Cancel',
        labelSubmit: 'Confirm',
    };

    protected handleSubmit = async (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();
        this.props.onSubmit();
    };

    public render() {
        const p = this.props;
        const placeholder = 'Account password';

        return (
            <Dialog
                onClickCross={p.onClose}
                className="sonm-confirmation-dialog"
            >
                <Form
                    onSubmit={this.handleSubmit}
                    className="sonm-confirmation-dialog__form"
                >
                    <FormRow>
                        <h3 className="sonm-confirmation-dialog__header">
                            {p.labelHeader}
                        </h3>
                    </FormRow>
                    {p.labelSubheader ? (
                        <FormRow>
                            <h1 className="sonm-confirmation-dialog__subheader">
                                {p.labelSubheader}
                            </h1>
                        </FormRow>
                    ) : null}
                    {p.children}
                    <FormRow>
                        <FormField
                            fullWidth
                            label={placeholder}
                            error={p.validationMessage}
                            className={cn(
                                'sonm-confirmation-dialog__label',
                                p.validationMessage !== ''
                                    ? 'sonm-confirmation-dialog__label--error'
                                    : '',
                            )}
                        >
                            <Password
                                name="password"
                                className="sonm-confirmation-dialog__input"
                                placeholder=""
                                value={p.password}
                                onChange={p.onChangePassword}
                            />
                        </FormField>
                    </FormRow>
                    <div className="sonm-confirmation-dialog__buttons">
                        <a
                            className="sonm-confirmation-dialog__cancel-button"
                            onClick={p.onCancel}
                            color="violet"
                        >
                            {p.labelCancel}
                        </a>

                        <Button
                            className="sonm-confirmation-dialog__submit-button"
                            type="submit"
                            color="violet"
                            disabled={p.submitDisabled}
                        >
                            {p.labelSubmit}
                        </Button>
                    </div>
                </Form>
            </Dialog>
        );
    }
}
