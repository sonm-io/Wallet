import * as React from 'react';
import { Form, FormField } from 'app/components/common/form';
import { Password } from 'app/components/common/password';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';
import * as cn from 'classnames';

export interface IConfirmationPanelProps extends Partial<IMessages> {
    validationMessage?: string;
    /**
     * If not set, then button is disabled.
     */
    onSubmit?: (password: string) => void;
    /**
     * If not set, then button doesn't appear.
     */
    onCancel?: () => void;
    className: string;
}

interface IState extends IMessages {
    password: string;
}

interface IMessages {
    header: string;
    description: string;
    cancelBtnLabel: string;
    submitBtnLabel: string;
}

export class ConfirmationPanel extends React.Component<
    IConfirmationPanelProps,
    IState
> {
    private static defaults: IMessages = {
        header: 'Confirm operation',
        description:
            'Please, enter password for this account to confirm operation',
        cancelBtnLabel: 'Cancel',
        submitBtnLabel: 'NEXT',
    };

    constructor(props: IConfirmationPanelProps) {
        super(props);
    }

    public static getDerivedStateFromProps(props: IConfirmationPanelProps) {
        return (Object.keys(ConfirmationPanel.defaults) as Array<
            keyof IMessages
        >).reduce((acc: Partial<IMessages>, i) => {
            acc[i] =
                props[i] !== undefined
                    ? props[i]
                    : ConfirmationPanel.defaults[i];
            return acc;
        }, {});
    }

    protected handleChangePassword = (params: IChangeParams<string>) => {
        this.setState({ password: params.value });
    };

    protected handleSubmit = (event: React.FormEvent<any>) => {
        event.preventDefault();
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.password);
        }
    };

    public render() {
        return (
            <div className={cn('confirmation-panel', this.props.className)}>
                <h2 className="confirmation-panel__header">
                    {this.state.header}
                </h2>
                <span className="confirmation-panel__description">
                    {this.state.description}
                </span>
                <Form
                    onSubmit={this.handleSubmit}
                    className="confirmation-panel__form"
                >
                    <FormField
                        label=""
                        className="confirmation-panel__field"
                        error={this.props.validationMessage}
                    >
                        <Password
                            name="password"
                            className="confirmation-panel__input"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChangePassword}
                        />
                    </FormField>

                    <div className="confirmation-panel__buttons">
                        {this.props.onCancel ? (
                            <Button
                                className="confirmation-panel__cancel-button"
                                onClick={this.props.onCancel}
                                color="violet"
                            >
                                {this.state.cancelBtnLabel}
                            </Button>
                        ) : null}
                        <Button
                            className="confirmation-panel__submit-button"
                            disabled={this.props.onSubmit === undefined}
                            onClick={this.handleSubmit}
                            type="submit"
                            color="violet"
                        >
                            {this.state.submitBtnLabel}
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
