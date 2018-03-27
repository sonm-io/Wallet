import * as React from 'react';
import * as cn from 'classnames';
import * as propTypes from 'prop-types';
import {
    ICalendarOptionalProps,
    ICalendarProps,
    ICalendarAllProps,
    ICalendarCssClasses,
    IDateInfo,
} from './types';
import { TJsPropTypes } from '../types';

let valuePropType;

export class Calendar extends React.PureComponent<ICalendarProps, any> {
    public static getMonthLen = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();

    public static readonly shortDayNames = [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
    ];

    public static readonly dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    public static readonly monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    public static readonly shortMonthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    public static readonly getDefaultCssClasses = (
        rootClassName: string,
    ): ICalendarCssClasses => ({
        root: rootClassName,
        emptyDay: `${rootClassName}__dummy`,
        day: `${rootClassName}__day`,
        markedDay: `${rootClassName}__day--marked`,
        today: `${rootClassName}__day--today`,
        tableOfDays: `${rootClassName}__table-of-days`,
        dayName: `${rootClassName}__day-name`,
        selectedDay: `${rootClassName}__day--selected`,
        targetDay: `${rootClassName}__day--target`,
        disabledDay: `${rootClassName}__day--disabled`,
    });

    public static readonly format = (value: Date) => {
        const d = Calendar.getDateInfo(value);

        return (
            '' +
            d.date +
            ' ' +
            String(Calendar.monthNames[d.month]) +
            ' ' +
            d.year
        );
    };

    public static readonly shortFormat = (value: Date) => {
        const d = Calendar.getDateInfo(value);

        return (
            '' +
            d.date +
            ' ' +
            String(Calendar.shortMonthNames[d.month]).toLocaleLowerCase() +
            ' ' +
            d.year
        );
    };

    public static readonly defaultProps: ICalendarOptionalProps = {
        calendarCssClasses: Calendar.getDefaultCssClasses('calendar'),
        shortDayNames: Calendar.shortDayNames,
        shortMonthNames: Calendar.shortMonthNames,
        monthNames: Calendar.monthNames,
        dayNames: Calendar.dayNames,
        startWithMonday: false,
        useTimestamp: false,
        className: '',
        valueToString: Calendar.format,
        targetDate: undefined,
        visibleMonth: undefined,
        visibleYear: undefined,
        disableAfter: undefined,
        disableBefore: undefined,
    };

    public static propTypes: TJsPropTypes<ICalendarAllProps> = {
        onChange: propTypes.func.isRequired,
        value: (valuePropType = propTypes.oneOfType([
            propTypes.instanceOf(Date),
        ])),
        targetDate: valuePropType,
        useTimestamp: propTypes.bool,
        startWithMonday: propTypes.bool,
        monthNames: propTypes.arrayOf(propTypes.string),
        shortDayNames: propTypes.arrayOf(propTypes.string),
        shortMonthNames: propTypes.arrayOf(propTypes.string),
        dayNames: propTypes.arrayOf(propTypes.string),
        calendarCssClasses: propTypes.shape({
            root: propTypes.string,
            emptyDay: propTypes.string,
            day: propTypes.string,
            markedDay: propTypes.string,
            currentDay: propTypes.string,
            month: propTypes.string,
            dayName: propTypes.string,
        }),
        name: propTypes.string.isRequired,
        className: propTypes.string.isRequired,
        visibleMonth: propTypes.number,
        visibleYear: propTypes.number,
        valueToString: propTypes.func,
        disableAfter: valuePropType,
        disableBefore: valuePropType,
    };

    public static getDateInfo(v: Date): IDateInfo {
        const value = new Date(v as any);
        const day = value.getDay();
        const month = value.getMonth();
        const year = value.getFullYear();
        const date = value.getDate();
        const monthLength = Calendar.getMonthLen(year, month);
        const weekOffsetDay = new Date(year, month, 1).getDay();

        return {
            day,
            month,
            year,
            date,
            monthLength,
            weekOffsetDay,
        };
    }

    protected static getDateValue(
        yearOrDate: number | Date,
        month?: number,
        day?: number,
    ): number {
        const date =
            arguments.length === 1
                ? new Date(yearOrDate as any)
                : new Date(Number(yearOrDate), month || 0, day || 1);

        return (
            date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()
        );
    }

    protected getProps(): ICalendarAllProps {
        return this.props as ICalendarAllProps;
    }

    protected handleClickDay = (event: any) => {
        const date = event.target.value;
        const { visibleYear, visibleMonth } = this.getVisibleMonth(
            this.getProps(),
        );
        const value = new Date(visibleYear, visibleMonth, date);

        const props = this.getProps();
        props.onChange({
            value,
            name: props.name,
            valueString: props.valueToString(value),
        });
    };

    protected getVisibleMonth(props: ICalendarAllProps) {
        let visibleYear: number;
        let visibleMonth: number;
        if (
            props.visibleYear !== undefined &&
            props.visibleMonth !== undefined
        ) {
            visibleYear = props.visibleYear;
            visibleMonth = props.visibleMonth;
        } else {
            const valueDateInfo = Calendar.getDateInfo(props.value);
            visibleYear = valueDateInfo.year;
            visibleMonth = valueDateInfo.month;
        }

        return { visibleYear, visibleMonth };
    }

    public render() {
        const props = this.getProps();
        const cssClasses = props.calendarCssClasses;
        const { visibleYear, visibleMonth } = this.getVisibleMonth(props);

        const visibleDateInfo = Calendar.getDateInfo(
            new Date(visibleYear, visibleMonth, 1),
        );
        const { month, year, monthLength, weekOffsetDay } = visibleDateInfo;

        const arrayOfDayElement = props.shortDayNames.map((name: string) => (
            <div className={cssClasses.dayName} key={name}>
                {name}
            </div>
        ));

        let monthDate = 1 - weekOffsetDay;

        const hasSelectionRange = props.targetDate !== undefined;
        const targetTimestamp = hasSelectionRange
            ? Calendar.getDateValue(props.targetDate as Date)
            : 0;
        const valueTimestamp = Calendar.getDateValue(props.value);
        const selectionRange = [targetTimestamp, valueTimestamp].sort();
        const todayTimestamp = Calendar.getDateValue(new Date());
        const disableAfter = props.disableAfter
            ? Calendar.getDateValue(props.disableAfter)
            : 0;
        const disableBefore = props.disableBefore
            ? Calendar.getDateValue(props.disableBefore)
            : 0;

        while (monthDate <= monthLength) {
            if (monthDate <= 0) {
                arrayOfDayElement.push(
                    <div className={cssClasses.emptyDay} key={monthDate} />,
                );
            } else {
                const dayTimestamp = Calendar.getDateValue(
                    year,
                    month,
                    monthDate,
                );

                const marked =
                    hasSelectionRange &&
                    dayTimestamp >= selectionRange[0] &&
                    dayTimestamp <= selectionRange[1];

                const datePos = monthDate + weekOffsetDay - 1;
                const week = Math.floor(datePos / 7);
                const dayIdx = datePos % 7;
                const day = String(Calendar.dayNames[dayIdx]).toLowerCase();
                const disabled =
                    (disableAfter !== 0 && dayTimestamp > disableAfter) ||
                    (disableBefore !== 0 && dayTimestamp < disableBefore);

                arrayOfDayElement.push(
                    <button
                        type="button"
                        key={monthDate}
                        value={monthDate}
                        onClick={disabled ? undefined : this.handleClickDay}
                        className={cn(
                            cssClasses.day,
                            day,
                            `day-${dayIdx}`,
                            `week-${week}`,
                            {
                                [cssClasses.markedDay]: marked,
                                [cssClasses.today]:
                                    todayTimestamp === valueTimestamp,
                                [cssClasses.selectedDay]:
                                    dayTimestamp === valueTimestamp,
                                // 'day-target': dayTimestamp === valueTimestamp,
                                // 'day-after-target': targetTimestamp && (targetTimestamp <= dayTimestamp),
                                // 'day-before-target': targetTimestamp && (targetTimestamp > dayTimestamp),
                                [cssClasses.targetDay]:
                                    dayTimestamp === targetTimestamp,
                                [cssClasses.disabledDay]: disabled,
                            },
                        )}
                    >
                        {monthDate}
                    </button>,
                );
            }
            ++monthDate;
        }

        return (
            <div className={cn(props.className, cssClasses.root)}>
                {arrayOfDayElement}
            </div>
        );
    }
}

export default Calendar;

export * from './types';
