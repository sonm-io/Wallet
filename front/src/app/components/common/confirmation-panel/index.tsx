import * as React from 'react';
import { Form, FormField } from 'app/components/common/form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';

export interface IConfirmationPanelProps extends Partial<IMessages> {
    validationMessage?: string;
    onSubmit: (password: string) => void;
    onCancel?: () => void;
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

        this.state = (Object.keys(ConfirmationPanel.defaults) as Array<
            keyof IMessages
        >).reduce(
            (acc: Partial<IState>, key) => {
                acc[key] = ConfirmationPanel.defaults[key];
                return acc;
            },
            { password: '' },
        ) as IState;
    }

    protected handleChangePassword = (params: IChangeParams<string>) => {
        this.setState({ password: params.value });
    };

    protected handleSubmit = (event: React.FormEvent<any>) => {
        event.preventDefault();
        this.props.onSubmit(this.state.password);
    };

    public render() {
        return (
            <div className="confirmation-panel">
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
                        <Input
                            name="password"
                            className="confirmation-panel__input"
                            type="password"
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
