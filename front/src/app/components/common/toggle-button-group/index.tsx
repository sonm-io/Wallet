import * as React from 'react';
import { ToggleGroup, IToggleGroupProps } from '../toggle-group';
import { ToggleButton } from '../toggle-button';

export function ToggleButtonGroup<TValue>(props: IToggleGroupProps<TValue>) {
    class Clazz extends ToggleGroup<TValue> {}

    return <Clazz {...props} elementCtor={ToggleButton} />;
}

export default ToggleButtonGroup;
