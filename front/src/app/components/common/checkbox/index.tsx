import * as React from 'react';
import { Toggler, ITogglerProps, ICssClasses } from '../toggler';

export interface ICheckboxProps extends ITogglerProps {}

const defaultCssClasses: ICssClasses = {
    input: 'sonm-checkbox__input',
    label: 'sonm-checkbox',
    cradle: 'sonm-checkbox__cradle',
    title: 'sonm-checkbox__title',
};

export function Checkbox(props: ICheckboxProps) {
    const cssClasses = props.cssClasses ? props.cssClasses : defaultCssClasses;

    return <Toggler {...props} cssClasses={cssClasses} />;
}
