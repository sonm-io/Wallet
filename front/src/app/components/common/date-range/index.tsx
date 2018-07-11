import * as React from 'react';
import * as cn from 'classnames';
import { DatePicker } from '../date-picker';
import { Calendar } from '../calendar';

import {
    IDateRangeProps,
    TDateRangeValue,
    IDateRangeOptionalProps,
    IDateRangeAllProps,
} from './types';

export class DateRange extends React.Component<IDateRangeProps, any> {
    public static defaultProps: IDateRangeOptionalProps = {
        valueToString: DateRange.format,
        className: '',
        leftPickerProps: undefined,
        rightPickerProps: undefined,
    };

    protected static getDefaultDate = () => new Date(0);

    protected static getDateOrDefault = (
        value: TDateRangeValue | undefined,
        index: 0 | 1,
    ) => (value === undefined ? DateRange.getDefaultDate() : value[index]);

    public static format(value?: TDateRangeValue): string {
        const from = Calendar.format(DateRange.getDateOrDefault(value, 0));
        const to = Calendar.format(DateRange.getDateOrDefault(value, 1));
        return `${from} ~ ${to}`;
    }

    protected static isDateEqual(
        date1: Date | undefined,
        date2: Date | undefined,
    ) {
        if (date1 !== undefined && date2 !== undefined) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        } else {
            return false;
        }
    }

    protected onChange = (params: any) => {
        const value =
            this.props.value === undefined
                ? ([
                      DateRange.getDefaultDate(),
                      DateRange.getDefaultDate(),
                  ] as TDateRangeValue)
                : ([
                      this.props.value[0],
                      this.props.value[1],
                  ] as TDateRangeValue);

        const isRangeEnd = params.name === 'to';
        const idx = isRangeEnd ? 1 : 0;
        value[idx] = params.value;
        const stringValue = this.getProps().valueToString(value);

        if (isRangeEnd) {
            value[idx].setHours(23);
            value[idx].setMinutes(59);
            value[idx].setSeconds(59);
            value[idx].setMilliseconds(999);
        }

        if (this.props.onChange) {
            this.props.onChange({
                value,
                stringValue,
                name,
            });
        }
    };

    protected getProps(): IDateRangeAllProps {
        return this.props as IDateRangeAllProps;
    }

    public shouldComponentUpdate(next: IDateRangeProps) {
        const props = this.props;

        return (
            props.className !== next.className ||
            props.leftPickerProps !== next.leftPickerProps ||
            props.rightPickerProps !== next.rightPickerProps ||
            !DateRange.isDateEqual(
                DateRange.getDateOrDefault(props.value, 0),
                DateRange.getDateOrDefault(next.value, 0),
            ) ||
            !DateRange.isDateEqual(
                DateRange.getDateOrDefault(props.value, 1),
                DateRange.getDateOrDefault(next.value, 1),
            )
        );
    }

    public render() {
        const { value: fromTo, className } = this.props;
        const from = DateRange.getDateOrDefault(fromTo, 0);
        const to = DateRange.getDateOrDefault(fromTo, 1);

        return (
            <div className={cn('date-range', className)}>
                <DatePicker
                    className="date-range__picker"
                    name="from"
                    onChange={this.onChange}
                    value={from}
                    targetDate={to}
                    disableAfter={to}
                />
                <DatePicker
                    className="date-range__picker"
                    name="to"
                    onChange={this.onChange}
                    value={to}
                    targetDate={from}
                    disableBefore={from}
                />
            </div>
        );
    }
}

export default DateRange;

export * from './types';
