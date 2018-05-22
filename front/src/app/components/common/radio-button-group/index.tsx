import * as React from 'react';
import { ToggleGroup, IToggleGroupBaseProps } from '../toggle-group';
import { RadioButton } from '../radio-button';

export function RadioButtonGroup<TValue>(props: IToggleGroupBaseProps<TValue>) {
    class Clazz extends ToggleGroup<TValue> {}

    return <Clazz {...props} elementCtor={RadioButton} />;
}

export default RadioButtonGroup;
