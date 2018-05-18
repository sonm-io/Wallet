import * as React from 'react';
import * as cn from 'classnames';
import { IChengable, IChengableProps } from '../types';
import { IToggleGroupItem } from '../toggle-group';

export interface ToggleButtonProps
    extends IChengableProps<boolean>,
        IToggleGroupItem {}

export class ToggleButton extends React.Component<ToggleButtonProps, never>
    implements IChengable<boolean> {
    protected handleChageInput = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        this.props.onChange &&
            this.props.onChange({
                name: this.props.name,
                value: event.target.checked,
            });
    };

    public render() {
        return (
            <label className={cn('toggle-button', this.props.className)}>
                <input
                    className="toggle-button__radio"
                    type="radio"
                    name={this.props.groupName || this.props.name}
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
