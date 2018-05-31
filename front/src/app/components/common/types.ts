export type TJsPropTypes<T> = { [K in keyof T]: any };

//#region Changable

export type FnOnChange<TValue> = (params: IChangeParams<TValue>) => void;

export interface IChengableProps<TValue> {
    value?: TValue;
    name: string;
    onChange?: FnOnChange<TValue>;
}

export interface IChangeParams<TValue> {
    name: string;
    value: TValue;
    stringValue?: string;
}

//#endregion Changable

export interface IFocusable {
    focus: () => void;
}

export interface ITogglerBaseProps extends IChengableProps<boolean> {
    title: string;
    className?: string;
    groupName?: string;
    disabled?: boolean;
}
