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
        const p = this.props;
        return (
            <label
                className={cn(
                    'toggle-button',
                    p.disabled ? 'toggle-button--disabled' : null,
                    p.className,
                )}
            >
                <input
                    className="toggle-button__radio"
                    disabled={p.disabled}
                    type={p.groupName ? 'radio' : 'checkbox'}
                    name={p.groupName ? p.groupName : p.name}
                    checked={p.value}
                    onChange={this.handleChageInput}
                />
                <span className="toggle-button__button">{p.title}</span>
            </label>
        );
    }
}

export default ToggleButton;
