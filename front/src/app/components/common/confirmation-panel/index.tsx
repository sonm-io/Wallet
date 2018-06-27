import * as React from 'react';
import { Form, FormField } from 'app/components/common/form';
import { Password } from 'app/components/common/password';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';
import * as cn from 'classnames';
import { Icon, IconButton } from '../icon';

export enum EnumConfirmationDisplay {
    OneLine = 'one-line',
    FullHeight = 'full-height',
}

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
    displayMode?: EnumConfirmationDisplay;

    labelHeader?: string;
    labelDescription?: string;
    labelCancel?: string;
    labelSubmit?: string;

    showCloseButton?: boolean;
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
        event.stopPropagation();
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.password);
        }
    };

    protected handleCancel = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    //#region Render Block

    public renderHeader = () => {
        const p = this.props;
        return (
            <React.Fragment>
                <h4 className="confirmation-panel__header">
                    {p.showCloseButton ? (
                        <IconButton
                            className="confirmation-panel__close-button"
                            i="Close"
                            onClick={this.handleCancel}
                        />
                    ) : null}
                    {p.labelHeader}
                </h4>
                <span className="confirmation-panel__description">
                    {p.labelDescription}
                </span>
            </React.Fragment>
        );
    };

    public renderInput = () => {
        const p = this.props;
        return (
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
        );
    };

    public renderCancel = () => {
        const p = this.props;
        return p.onCancel ? (
            <a
                className="confirmation-panel__cancel-button"
                onClick={this.handleCancel}
                color="violet"
            >
                <Icon i="ArrowBack" /> {p.labelCancel}
            </a>
        ) : null;
    };

    public renderNext = () => {
        const p = this.props;
        return (
            <Button
                className="confirmation-panel__submit-button"
                disabled={p.onSubmit === undefined}
                onClick={this.handleSubmit}
                type="submit"
                color="violet"
            >
                {p.labelSubmit}
            </Button>
        );
    };

    //#endregion

    public renderOneLine() {
        const p = this.props;
        return (
            <Form
                onSubmit={this.handleSubmit}
                className={cn(
                    'confirmation-panel confirmation-panel--one-line',
                    p.className,
                )}
            >
                {this.renderCancel()}
                <div className="confirmation-panel--one-line__field">
                    {this.renderHeader()}
                    {this.renderInput()}
                </div>
                {this.renderNext()}
            </Form>
        );
    }

    public renderFullHeight() {
        const p = this.props;
        return (
            <Form
                onSubmit={this.handleSubmit}
                className={cn(
                    'confirmation-panel confirmation-panel--full-height',
                    p.className,
                )}
            >
                {this.renderHeader()}
                {this.renderInput()}
                <div className="confirmation-panel--full-height__buttons">
                    {this.renderCancel()}
                    {this.renderNext()}
                </div>
            </Form>
        );
    }

    public render() {
        const p = this.props;
        return p.displayMode === EnumConfirmationDisplay.OneLine
            ? this.renderOneLine()
            : this.renderFullHeight();
    }
}
