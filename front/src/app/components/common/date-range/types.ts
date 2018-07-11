import { IDatePickerProps } from '../date-picker';
import { IChengableProps } from 'app/components/common/types';

export type TDateRangeValue = [Date, Date];

export interface IDateRangeOptionalProps {
    className: string;
    leftPickerProps: IDatePickerProps | undefined;
    rightPickerProps: IDatePickerProps | undefined;
    valueToString: (value?: TDateRangeValue) => string;
    disabled?: boolean;
}

export type IDateRangeProps = IChengableProps<TDateRangeValue> &
    Partial<IDateRangeOptionalProps>;

export type IDateRangeAllProps = IChengableProps<TDateRangeValue> &
    IDateRangeOptionalProps;
