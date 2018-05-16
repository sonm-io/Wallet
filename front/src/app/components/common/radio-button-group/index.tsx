import { ToggleGroup } from '../toggle-group';
import { RadioButton } from '../radio-button';
export class RadioButtonGroup<TValue> extends ToggleGroup<
    TValue,
    RadioButton<TValue>
> {}
