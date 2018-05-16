import * as React from 'react';
import { Toggler, ICssClasses } from '../toggler';
import { IToggle } from '../toggle-button/types';
import { ITogglerChangeParams } from '../toggler';

export interface IRadioButtonProps<TValue> extends IToggle<TValue> {
    cssClasses?: ICssClasses;
    titleBefore?: boolean;
}

const defaultCssClasses: ICssClasses = {
    input: 'sonm-radio-button__input',
    label: 'sonm-radio-button',
    cradle: 'sonm-radio-button__cradle',
    title: 'sonm-radio-button__title',
};

export class RadioButton<TValue> extends React.Component<
    IRadioButtonProps<TValue>,
    never
> {
    protected handleChange = (params: ITogglerChangeParams) => {
        this.props.onChange &&
            this.props.onChange(
                params.value,
                this.props.value,
                this.props.groupName,
            );
    };

    public render() {
        const cssClasses = this.props.cssClasses
            ? this.props.cssClasses
            : defaultCssClasses;
        const { className, title, groupName, checked } = this.props; // IToggle

        return (
            <Toggler
                className={className}
                cssClasses={cssClasses}
                onChange={this.handleChange}
                type="radio"
                name={groupName || ''}
                value={checked || false}
                title={title || ''}
                titleBefore={this.props.titleBefore}
            />
        );
    }
}
