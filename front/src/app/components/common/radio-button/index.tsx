import * as React from 'react';
import { Toggler, ICssClasses } from '../toggler';
import { IChengable, IChengableProps } from '../types';
import { ITogglerChangeParams } from '../toggler';
import { IToggleGroupItem } from '../toggle-group';

export interface IRadioButtonProps
    extends IChengableProps<boolean>,
        IToggleGroupItem {
    cssClasses?: ICssClasses;
    titleBefore?: boolean;
}

export class RadioButton extends React.Component<IRadioButtonProps, never>
    implements IChengable<boolean> {
    protected handleChange = (params: ITogglerChangeParams) => {
        this.props.onChange &&
            this.props.onChange({
                name: this.props.name,
                value: params.value,
            });
    };

    public render() {
        const cssClasses = this.props.cssClasses
            ? this.props.cssClasses
            : RadioButton.defaultCssClasses;
        const { className, title, groupName, name, value } = this.props;

        return (
            <Toggler
                className={className}
                cssClasses={cssClasses}
                onChange={this.handleChange}
                name={name}
                groupName={groupName}
                value={value}
                title={title || ''}
                titleBefore={this.props.titleBefore}
            />
        );
    }

    protected static defaultCssClasses: ICssClasses = {
        input: 'sonm-radio-button__input',
        label: 'sonm-radio-button',
        cradle: 'sonm-radio-button__cradle',
        title: 'sonm-radio-button__title',
    };
}
