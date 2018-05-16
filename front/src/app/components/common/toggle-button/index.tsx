import * as React from 'react';
import * as cn from 'classnames';
import { IToggle } from './types';

export class ToggleButton<TValue> extends React.Component<
    IToggle<TValue>,
    never
> {
    protected handleChageInput = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        this.props.onChange &&
            this.props.onChange(
                event.target.checked,
                this.props.value,
                this.props.groupName,
            );
    };

    public render() {
        return (
            <label className={cn('toggle-button', this.props.className)}>
                <input
                    className="toggle-button__radio"
                    type="radio"
                    value={this.props.value as any}
                    name={this.props.groupName}
                    checked={this.props.checked}
                    onChange={this.handleChageInput}
                />
                <span className="toggle-button__button">
                    {this.props.title}
                </span>
            </label>
        );
    }
}
