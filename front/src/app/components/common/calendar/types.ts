export interface ICalendarChangeParams {
    name: string;
    value: Date;
    valueString: string;
}

export interface ICalendarRequiredProps {
    onChange: (params: ICalendarChangeParams) => void;
    value: Date;
    name: string;
}

export interface ICalendarOptionalProps {
    useTimestamp: boolean;
    startWithMonday: boolean;
    monthNames: string[];
    shortMonthNames: string[];
    dayNames: string[];
    shortDayNames: string[];
    calendarCssClasses: ICalendarCssClasses;
    className: string;
    targetDate: Date | undefined;
    disabled: boolean;
    disableAfter: Date | undefined;
    disableBefore: Date | undefined;
    visibleMonth: number | undefined;
    visibleYear: number | undefined;
    valueToString: (value: ICalendarProps['value']) => string;
}

export type ICalendarProps = ICalendarRequiredProps &
    Partial<ICalendarOptionalProps>;

export type ICalendarAllProps = ICalendarRequiredProps & ICalendarOptionalProps;

export interface ICalendarCssClasses {
    root: string;
    emptyDay: string;
    day: string;
    markedDay: string;
    today: string;
    tableOfDays: string;
    dayName: string;
    selectedDay: string;
    targetDay: string;
    disabledDay: string;
}

export interface IDateInfo {
    day: number;
    month: number;
    year: number;
    date: number;
    monthLength: number;
    weekOffsetDay: number;
}
