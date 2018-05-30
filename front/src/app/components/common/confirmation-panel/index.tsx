import * as React from 'react';
import { Form, FormField } from 'app/components/common/form';
import { Password } from 'app/components/common/password';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';
import * as cn from 'classnames';

export interface IConfirmationPanelProps {
    validationMessage?: string;
    /**
     * If not set, then button is disabled.
     */
    onSubmit?: (password: string) => void;
    /**
     * If not set, then button doesn't appear.
     */
    onCancel?: () => void;
    className?: string;

    labelHeader?: string;
    labelDescription?: string;
    labelCancel?: string;
    labelSubmit?: string;
}

interface IState {
    password: string;
}

export class ConfirmationPanel extends React.Component<
    IConfirmationPanelProps,
    IState
> {
    public static defaultProps: Partial<IConfirmationPanelProps> = {
        labelHeader: 'Confirm operation',
        labelDescription:
            'Please, enter password for this account to confirm operation',
        labelCancel: 'Cancel',
        labelSubmit: 'NEXT',
    };

    public state = {
        password: '',
    };

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
        const p = this.props;

        return (
            <div className={cn('confirmation-panel', p.className)}>
                <h4 className="confirmation-panel__header">{p.labelHeader}</h4>
                <span className="confirmation-panel__description">
                    {p.labelDescription}
                </span>
                <Form
                    onSubmit={this.handleSubmit}
                    className="confirmation-panel__form"
                >
                    <FormField
                        label=""
                        className="confirmation-panel__field"
                        error={p.validationMessage}
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
                                onClick={p.onCancel}
                                color="violet"
                            >
                                {p.labelCancel}
                            </Button>
                        ) : null}
                        <Button
                            className="confirmation-panel__submit-button"
                            disabled={p.onSubmit === undefined}
                            onClick={this.handleSubmit}
                            type="submit"
                            color="violet"
                        >
                            {p.labelSubmit}
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
