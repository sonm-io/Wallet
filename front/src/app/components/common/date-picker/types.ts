import {
    ICalendarCssClasses,
    ICalendarChangeParams,
    ICalendarOptionalProps,
    ICalendarRequiredProps,
} from '../calendar';

export interface IDatePickerChangeParams extends ICalendarChangeParams {}

export interface IDatePickerOptionalProps extends ICalendarOptionalProps {
    useTimestamp: boolean;
    className: string;
    calendarCssClasses: ICalendarCssClasses;
    datePickerCssClasses: IDatePickerCssClasses;
}

export interface IDatePickerRequiredProps extends ICalendarRequiredProps {}

export type IDatePickerAllProps = IDatePickerRequiredProps &
    IDatePickerOptionalProps;

export type IDatePickerProps = IDatePickerRequiredProps &
    Partial<IDatePickerOptionalProps>;

export interface IDatePickerCssClasses {
    root: string;
    tableOfMonths: string;
    monthButton: string;
    month: string;
    selectedMonth: string;
    yearInput: string;
    yearButton: string;
    prevMonthButton: string;
    nextMonthButton: string;
    title: string;
    valueDay: string;
}

export interface IDatePickerState {
    mode: 'day' | 'month' | 'year';
    inputYear: string;
    visibleMonth: number;
    visibleYear: number;
}
