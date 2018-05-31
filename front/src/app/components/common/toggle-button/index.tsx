import * as React from 'react';
import * as cn from 'classnames';
import { ITogglerBaseProps } from '../types';

export interface IToggleButtonProps extends ITogglerBaseProps {}

export class ToggleButton extends React.Component<IToggleButtonProps, never> {
    protected handleChageInput = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (this.props.onChange !== undefined) {
            this.props.onChange({
                name: this.props.name,
                value: event.target.checked,
            });
        }
    };

    public render() {
        return (
            <label className={cn('toggle-button', this.props.className)}>
                <input
                    className="toggle-button__radio"
                    disabled={this.props.disabled}
                    type={this.props.groupName ? 'radio' : 'checkbox'}
                    name={
                        this.props.groupName
                            ? this.props.groupName
                            : this.props.name
                    }
                    checked={this.props.value}
                    onChange={this.handleChageInput}
                />
                <span className="toggle-button__button">
                    {this.props.title}
                </span>
            </label>
        );
    }
}

export default ToggleButton;
