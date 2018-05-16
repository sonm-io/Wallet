import * as React from 'react';
import { Toggler, ITogglerProps, ICssClasses } from '../toggler';

export interface ICheckboxProps extends ITogglerProps {}

const defaultCssClasses: ICssClasses = {
    input: 'sonm-radio-button__input',
    label: 'sonm-radio-button',
    cradle: 'sonm-radio-button__cradle',
    title: 'sonm-radio-button__title',
};

export function RadioButton(props: ICheckboxProps) {
    const cssClasses = props.cssClasses ? props.cssClasses : defaultCssClasses;

    return <Toggler {...props} cssClasses={cssClasses} />;
}
