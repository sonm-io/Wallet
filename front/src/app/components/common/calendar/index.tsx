import * as React from 'react';
import * as cn from 'classnames';
import * as propTypes from 'prop-types';

type TDate = Date | number;

export interface IChangeParams {
    name: string;
    value: TDate;
    valueString: string;
}

export interface ICalendarOptionalProps {
    targetDate: TDate;
    useTimestamp: boolean;
    startWithMonday: boolean;
    dateFormatter: (date: TDate) => string;
    monthNames: Array<string>;
    shortMonthNames: Array<string>;
    dayNames: Array<string>;
    shortDayNames: Array<string>;
    cssClasses: ICalendarCssClasses;
}

export interface ICalendarRequiredProps {
    onChange: (params: IChangeParams) => void;
    value: TDate;
    name: string;
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
    tableOfMonths: string;
    dayName: string;
    monthButton: string;
    selectedDay: string;
    month: string;
    selectedMonth: string;
    yearInput: string;
    yearButton: string;
    prevMonthButton: string;
    nextMonthButton: string;
    valueDay: string;
    title: string;
}

interface ICalendarState {
    mode: 'day' | 'month' | 'year';
    inputYear: string;
    visibleMonth: number;
    visibleYear: number;
}

type TJsPropTypes = { [K in keyof ICalendarAllProps]: any };

interface IDateInfo {
    day: number;
    month: number;
    year: number;
    date: number;
    monthLength: number;
    weekOffsetDay: number;
}

export class Calendar extends React.PureComponent<
    ICalendarProps,
    ICalendarState
> {
    public static getMonthLen = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();

    public static shortDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    public static dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    public static monthNames = [
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

    public static shortMonthNames = [
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

    public static getDefaultCssClasses = (
        rootClassName: string,
    ): ICalendarCssClasses => ({
        root: rootClassName,
        emptyDay: `${rootClassName}__dummy`,
        day: `${rootClassName}__day`,
        markedDay: `${rootClassName}__day--marked`,
        today: `${rootClassName}__day--today`,
        tableOfDays: `${rootClassName}__table-of-days`,
        tableOfMonths: `${rootClassName}__table-of-months`,
        dayName: `${rootClassName}__day-name`,
        monthButton: `${rootClassName}__month-button`,
        selectedDay: `${rootClassName}__day--selected`,
        month: `${rootClassName}__month`,
        selectedMonth: `${rootClassName}__month--selected`,
        yearInput: `${rootClassName}__year-input`,
        yearButton: `${rootClassName}__year-button`,
        prevMonthButton: `${rootClassName}__prev-month-button`,
        nextMonthButton: `${rootClassName}__next-month-button`,
        valueDay: `${rootClassName}__value-day`,
        title: `${rootClassName}__title`,
    });

    public static defaultProps: ICalendarOptionalProps = {
        cssClasses: Calendar.getDefaultCssClasses('calendar'),
        shortDayNames: Calendar.shortDayNames,
        shortMonthNames: Calendar.shortMonthNames,
        monthNames: Calendar.monthNames,
        targetDate: 0,
        dayNames: Calendar.dayNames,
        startWithMonday: false,
        useTimestamp: false,
        dateFormatter: (value: TDate) => {
            const d = Calendar.getDateInfo(value);

            return (
                '' + d.date + ' ' + Calendar.monthNames[d.month] + ' ' + d.year
            );
        },
    };

    public static propTypes: TJsPropTypes = {
        onChange: propTypes.func.isRequired,
        value: propTypes.oneOfType([
            propTypes.instanceOf(Date),
            propTypes.number,
        ]),
        targetDate: propTypes.oneOfType([
            propTypes.instanceOf(Date),
            propTypes.number,
        ]),
        useTimestamp: propTypes.bool,
        startWithMonday: propTypes.bool,
        dateFormatter: propTypes.func,
        monthNames: propTypes.arrayOf(propTypes.string),
        shortDayNames: propTypes.arrayOf(propTypes.string),
        shortMonthNames: propTypes.arrayOf(propTypes.string),
        dayNames: propTypes.arrayOf(propTypes.string),
        cssClasses: propTypes.shape({
            root: propTypes.string,
            emptyDay: propTypes.string,
            day: propTypes.string,
            markedDay: propTypes.string,
            currentDay: propTypes.string,
            month: propTypes.string,
            dayName: propTypes.string,
        }),
        name: propTypes.string.isRequired,
    };

    public constructor(props: ICalendarAllProps, ...args: any[]) {
        super(props, ...args);

        this.state = {
            mode: 'day',
            inputYear: '',
            ...Calendar.stateFromProps(props),
        };
    }

    public state: ICalendarState;

    protected static stateFromProps(
        props: ICalendarAllProps,
    ): Pick<ICalendarState, 'visibleMonth' | 'visibleYear'> {
        const dateInfo = Calendar.getDateInfo(props.value);

        return {
            visibleMonth: dateInfo.month,
            visibleYear: dateInfo.year,
        };
    }

    public componentWillReceiveProps(nextProps: ICalendarAllProps) {
        const update = Calendar.stateFromProps(nextProps);

        if (this.state.mode === 'month') {
            delete update.visibleMonth;
        } else if (this.state.mode === 'year') {
            delete update.visibleYear;
        }

        this.setState(update);
    }

    public static getDateInfo(v: TDate): IDateInfo {
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

    public static getDateTimestamp(value: TDate, month?: number, day?: number) {
        if (typeof value === 'number' && arguments.length === 3) {
            return Date.UTC(value, month || 0, day || 1);
        } else {
            const v = new Date(value as any);
            return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
        }
    }

    protected handleChangeMonth = (event: any) => {
        const visibleMonth = Number(event.target.value);

        this.setState((state, props) => {
            return {
                mode: 'day',
                visibleMonth,
            };
        });
    };

    protected handleClickMonthTitle = () => {
        this.setState((state, props) => {
            return {
                mode: 'month',
            };
        });
    };

    protected stopInputYear() {
        const visibleYear = Number(this.state.inputYear);

        if (String(visibleYear) === this.state.inputYear) {
            this.setState({
                visibleYear: visibleYear,
            });
        }

        this.setState((state, props) => {
            return {
                mode: 'day',
            };
        });
    }

    protected handleBlurYear = () => {
        this.stopInputYear();
    };

    protected handleKeyPressYear = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // prevent click on year button
            this.stopInputYear();
        }
    };

    protected handleChange = (value: Date) => {
        const props = this.getProps();
        props.onChange({
            value: props.useTimestamp
                ? Calendar.getDateTimestamp(value)
                : value,
            name: props.name,
            valueString: props.dateFormatter(value),
        });
    };

    protected handleStartInputYear = () => {
        this.setState((state, props) => {
            return {
                mode: 'year',
                inputYear: String(this.state.visibleYear),
            };
        });
    };

    protected handleChangeYearInput = (event: any) => {
        const inputYear = event.target.value;
        this.setState((state, props) => {
            return {
                inputYear,
            };
        });
    };

    protected handleBackToValueDate = (event: any) => {
        event.preventDefault();

        this.setState({
            ...Calendar.stateFromProps(this.getProps()),
        });
    };

    protected getProps(): ICalendarAllProps {
        return this.props as ICalendarAllProps;
    }

    protected handleClickDay = (event: any) => {
        const { year, month } = Calendar.getDateInfo(this.props.value);
        const date = event.target.value;

        this.handleChange(new Date(year, month, date));
    };

    protected handleSwitchMonth(offs: number) {
        const sum = this.state.visibleMonth + offs;
        const visibleMonth = (sum + 12) % 12;

        let yearOffs = 0;
        if (sum > 11) {
            yearOffs = 1;
        } else if (sum < 0) {
            yearOffs = -1;
        }

        const visibleYear = this.state.visibleYear + yearOffs;

        this.setState({
            visibleYear,
            visibleMonth,
            mode: 'day',
        });
    }

    protected handleNextMonth = this.handleSwitchMonth.bind(this, 1);

    protected handlePrevMonth = this.handleSwitchMonth.bind(this, -1);

    public render() {
        const props = this.getProps();
        const cssClasses = props.cssClasses;
        const valueDateInfo = Calendar.getDateInfo(props.value);
        const visibleDateInfo = Calendar.getDateInfo(
            new Date(this.state.visibleYear, this.state.visibleMonth, 1),
        );

        return (
            <div className={cssClasses.root}>
                <button
                    className={cssClasses.prevMonthButton}
                    onClick={this.handlePrevMonth}
                />

                <div className={cssClasses.title}>
                    <button
                        type="button"
                        className={cssClasses.monthButton}
                        onClick={this.handleClickMonthTitle}
                    >
                        {props.monthNames[this.state.visibleMonth]}
                    </button>
                    {this.state.mode === 'year' ? (
                        <input
                            className={cssClasses.yearInput}
                            type="text"
                            value={this.state.inputYear}
                            onBlur={this.handleBlurYear}
                            onKeyPress={this.handleKeyPressYear}
                            onChange={this.handleChangeYearInput}
                        />
                    ) : (
                        <input
                            className={cssClasses.yearButton}
                            type="button"
                            value={this.state.visibleYear}
                            onClick={this.handleStartInputYear}
                        />
                    )}
                </div>

                <button
                    className={cssClasses.nextMonthButton}
                    onClick={this.handleNextMonth}
                />

                {this.state.mode === 'month' ? (
                    <div className={cssClasses.tableOfMonths}>
                        {this.renderMonths(
                            props,
                            valueDateInfo,
                            visibleDateInfo,
                        )}
                    </div>
                ) : (
                    <div className={cssClasses.tableOfDays}>
                        {this.renderDays(props, valueDateInfo, visibleDateInfo)}
                    </div>
                )}
                <a
                    className={cssClasses.valueDay}
                    href="#return-to-date"
                    onClick={this.handleBackToValueDate}
                >
                    {props.dateFormatter(props.value)}
                </a>
            </div>
        );
    }

    public renderDays(
        props: ICalendarAllProps,
        valueDateInfo: IDateInfo,
        visibleDateInfo: IDateInfo,
    ) {
        const { month, year, monthLength, weekOffsetDay } = visibleDateInfo;

        const cssClasses = props.cssClasses;

        const result = props.shortDayNames.map((name: string) => (
            <div className={cssClasses.dayName} key={name}>
                {name}
            </div>
        ));

        let monthDate = 1 - weekOffsetDay;

        const targetTimestamp =
            props.targetDate === 0
                ? 0
                : Calendar.getDateTimestamp(props.targetDate);
        const valueTimestamp = Calendar.getDateTimestamp(props.value);
        const hasSelectionRange =
            targetTimestamp !== 0 && targetTimestamp !== valueTimestamp;
        const selectionRange = [targetTimestamp, valueTimestamp].sort();

        while (monthDate <= monthLength) {
            if (monthDate <= 0) {
                result.push(
                    <div className={cssClasses.emptyDay} key={monthDate} />,
                );
            } else {
                const dayTimestamp = Calendar.getDateTimestamp(
                    year,
                    month,
                    monthDate,
                );
                let marked = false;
                let today =
                    Calendar.getDateTimestamp(Date.now()) === valueTimestamp;
                let selectedDay = dayTimestamp === valueTimestamp;

                if (hasSelectionRange) {
                    marked =
                        dayTimestamp >= selectionRange[0] &&
                        dayTimestamp <= selectionRange[1];
                }

                const datePos = monthDate + weekOffsetDay - 1;
                const week = Math.floor(datePos / 7);
                const dayIdx = datePos % 7;
                const day = String(Calendar.dayNames[dayIdx]).toLowerCase();

                result.push(
                    <button
                        type="button"
                        key={monthDate}
                        value={monthDate}
                        onClick={this.handleClickDay}
                        className={cn(
                            cssClasses.day,
                            day,
                            `day-${dayIdx}`,
                            `week-${week}`,
                            {
                                [cssClasses.markedDay]: marked,
                                [cssClasses.today]: today,
                                [cssClasses.selectedDay]: selectedDay,
                            },
                        )}
                    >
                        {monthDate}
                    </button>,
                );
            }
            ++monthDate;
        }

        return result;
    }

    renderMonths(
        props: ICalendarAllProps,
        valueDateInfo: IDateInfo,
        visibleDateInfo: IDateInfo,
    ) {
        return props.monthNames.map((name: string, idx: number) => {
            return (
                <button
                    type="button"
                    className={props.cssClasses.month}
                    key={idx}
                    value={idx}
                    onClick={this.handleChangeMonth}
                >
                    {name}
                </button>
            );
        });
    }
}

export default Calendar;
