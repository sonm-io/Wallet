export interface IToggle<TValue> {
    className?: string;
    title?: string;
    groupName?: string;
    value?: TValue;
    checked?: boolean;
    onChange?: (checked: boolean, value?: TValue, groupName?: string) => void;
}
