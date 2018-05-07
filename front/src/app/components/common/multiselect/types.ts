export interface IMultiSelectChangeParams<T> {
    name: string;
    value: T[];
    valueString: string;
}

export interface IMultiSelectRequiredProps<T> {
    list: T[];
    value: T[];
    name: string;
    onChange: (params: IMultiSelectChangeParams<T>) => void;
    hasClearButton: boolean;
}

export interface IMultiSelectOptionalProps {
    label: string;
    className: string;
    nameIndex: string;
    filterPlaceHolder: string;
}

export type IMultiSelectAllProps<T> = IMultiSelectRequiredProps<T> &
    IMultiSelectOptionalProps;

export type IMultiSelectProps<T> = IMultiSelectRequiredProps<T> &
    Partial<IMultiSelectOptionalProps>;
