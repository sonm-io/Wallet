export interface IDropdownCssClasses {
    root: string;
    button: string;
    popup: string;
}

export interface IDropdownRequredInputProps {
    valueString: string;
    isExpanded: boolean;
    onButtonClick: () => void;
    onRequireClose: () => void;
    children: React.ReactNode;
}

export interface IDropdownOptionalInputProps {
    className: string;
    dropdownCssClasses: IDropdownCssClasses;
}

export type IDropdownAllProps = IDropdownRequredInputProps &
    IDropdownOptionalInputProps;

export type IDropdownInputProps = IDropdownRequredInputProps &
    Partial<IDropdownOptionalInputProps>;
