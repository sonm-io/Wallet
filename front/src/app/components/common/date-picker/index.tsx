import * as React from 'react';
import * as cn from 'classnames';
import * as propTypes from 'prop-types';
import { Calendar } from '../calendar';
import {
    IDatePickerProps,
    IDatePickerState,
    IDatePickerCssClasses,
    IDatePickerOptionalProps,
    IDatePickerAllProps,
} from './types';

export class DatePicker extends React.PureComponent<
    IDatePickerProps,
    IDatePickerState
> {
    public static getDefaultCssClasses = (
        rootClassName: string,
    ): IDatePickerCssClasses => ({
        root: rootClassName,
        tableOfMonths: `${rootClassName}__table-of-months`,
        monthButton: `${rootClassName}__month-button`,
        month: `${rootClassName}__month`,
        selectedMonth: `${rootClassName}__month--selected`,
        yearInput: `${rootClassName}__year-input`,
        yearButton: `${rootClassName}__year-button`,
        prevMonthButton: `${rootClassName}__prev-month-button`,
        nextMonthButton: `${rootClassName}__next-month-button`,
        valueDay: `${rootClassName}__value-day`,
        title: `${rootClassName}__title`,
    });

    public static propTypes = {
        ...Calendar.propTypes,
        datePickerCssClasses: propTypes.shape({
            root: propTypes.string,
            tableOfMonths: propTypes.string,
            monthButton: propTypes.string,
            month: propTypes.string,
            selectedMonth: propTypes.string,
            yearInput: propTypes.string,
            yearButton: propTypes.string,
            prevMonthButton: propTypes.string,
            nextMonthButton: propTypes.string,
            title: propTypes.string,
            valueDay: propTypes.string,
            disabledDay: propTypes.string,
        }),
    };

    public static defaultProps: IDatePickerOptionalProps = {
        ...Calendar.defaultProps,
        datePickerCssClasses: DatePicker.getDefaultCssClasses('date-picker'),
    };

    public constructor(props: IDatePickerProps, ...args: any[]) {
        super(props, ...args);

        this.state = {
            mode: 'day',
            inputYear: '',
            ...DatePicker.stateFromProps(props),
        };
    }

    public state: IDatePickerState;

    protected static stateFromProps(
        props: IDatePickerProps,
    ): Pick<IDatePickerState, 'visibleMonth' | 'visibleYear'> {
        const dateInfo = Calendar.getDateInfo(props.value);

        return {
            visibleMonth: dateInfo.month,
            visibleYear: dateInfo.year,
        };
    }

    public componentWillReceiveProps(nextProps: IDatePickerProps) {
        const update = DatePicker.stateFromProps(nextProps);

        if (this.state.mode === 'month') {
            delete update.visibleMonth;
        } else if (this.state.mode === 'year') {
            delete update.visibleYear;
        }

        this.setState(update);
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

        if (
            String(visibleYear) === this.state.inputYear &&
            visibleYear >= 0 &&
            visibleYear < 9999
        ) {
            this.setState({
                visibleYear,
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
        //
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
            ...DatePicker.stateFromProps(this.getProps()),
            mode: 'day',
        });
    };

    protected getProps(): IDatePickerAllProps {
        return this.props as IDatePickerAllProps;
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

    protected setFocus(ref: any) {
        if (ref && ref.focus) {
            ref.focus();
        }
    }

    public render() {
        const props = this.getProps();
        const state = this.state;
        const cssClasses = props.datePickerCssClasses;

        return (
            <div className={cn(cssClasses.root, props.className)}>
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
                        {props.monthNames[state.visibleMonth]}
                    </button>
                    {state.mode === 'year' ? (
                        <input
                            ref={this.setFocus}
                            className={cssClasses.yearInput}
                            type="text"
                            value={state.inputYear}
                            onBlur={this.handleBlurYear}
                            onKeyPress={this.handleKeyPressYear}
                            onChange={this.handleChangeYearInput}
                        />
                    ) : (
                        <input
                            className={cssClasses.yearButton}
                            type="button"
                            value={state.visibleYear}
                            onClick={this.handleStartInputYear}
                        />
                    )}
                </div>

                <button
                    className={cssClasses.nextMonthButton}
                    onClick={this.handleNextMonth}
                />

                {state.mode === 'month' ? (
                    <div className={cssClasses.tableOfMonths}>
                        {this.renderMonths(props)}
                    </div>
                ) : (
                    <Calendar
                        calendarCssClasses={props.calendarCssClasses}
                        onChange={this.props.onChange}
                        visibleMonth={state.visibleMonth}
                        visibleYear={state.visibleYear}
                        targetDate={props.targetDate}
                        disableAfter={props.disableAfter}
                        disableBefore={props.disableBefore}
                        value={props.value}
                        name={props.name}
                    />
                )}
                <a
                    className={cssClasses.valueDay}
                    href="#return-to-date"
                    onClick={this.handleBackToValueDate}
                >
                    {props.valueToString(props.value)}
                </a>
            </div>
        );
    }

    protected renderMonths(props: IDatePickerAllProps) {
        return props.monthNames.map((name: string, idx: number) => {
            return (
                <button
                    type="button"
                    className={props.datePickerCssClasses.month}
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

export default DatePicker;

export * from './types';
