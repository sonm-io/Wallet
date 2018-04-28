export interface IMultiSelectChangeParams<T> {
    name: string;
    value: T[];
    valueString: string;
}

export interface IMultiSelectRequiredInputProps<T> {
    list: T[];
    name: string;
    onChange: (params: IMultiSelectChangeParams<T>) => void;
    isExpanded: boolean;
    onButtonClick: () => void;
    onRequireClose: () => void;
    onButtonApplyClick: () => void;
    clearBtn: boolean;
    value: T[];
}

export interface IMultiSelectOptionalInputProps {
    label: string;
    className: string;
    nameIndex: string;
    valueIndex: string;
    throttleTime: number;
    filterPlaceHolder: string;
    panelStyle: object;
}

export type IMultiSelectInputProps<T> = IMultiSelectRequiredInputProps<T> &
    Partial<IMultiSelectOptionalInputProps>;
