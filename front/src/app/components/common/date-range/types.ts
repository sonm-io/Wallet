import { IDatePickerProps } from '../date-picker';

export interface IDateRangeChangeParams {
    name: string;
    value: [Date, Date];
    valueString: string;
}

export interface IDateRequredRangeProps {
    value: [Date, Date];
    onChange: (params: IDateRangeChangeParams) => void;
    name: string;
}

export interface IDateRangeOptionalProps {
    className: string;
    leftPickerProps: IDatePickerProps | undefined;
    rightPickerProps: IDatePickerProps | undefined;
    valueToString: (value: IDateRangeProps['value']) => string;
    disabled?: boolean;
}

export type IDateRangeProps = IDateRequredRangeProps &
    Partial<IDateRangeOptionalProps>;

export type IDateRangeAllProps = IDateRequredRangeProps &
    IDateRangeOptionalProps;

export type TDateRangeValue = [Date, Date];
