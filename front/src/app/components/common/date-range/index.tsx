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

    public static format(value: TDateRangeValue): string {
        return `${Calendar.format(value[0])} ~ ${Calendar.format(value[1])}`;
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
        const value = [
            this.props.value[0],
            this.props.value[1],
        ] as TDateRangeValue;
        const idx = params.name === 'from' ? 0 : 1;
        value[idx] = params.value;
        const valueString = this.getProps().valueToString(value);

        this.props.onChange({
            value,
            valueString,
            name,
        });
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
            !DateRange.isDateEqual(props.value[0], next.value[0]) ||
            !DateRange.isDateEqual(props.value[1], next.value[1])
        );
    }

    public render() {
        const { value, className } = this.props;

        return (
            <div className={cn('date-range', className)}>
                <DatePicker
                    className="date-range__picker"
                    name="from"
                    onChange={this.onChange}
                    value={value[0]}
                    targetDate={value[1]}
                />
                <DatePicker
                    className="date-range__picker"
                    name="to"
                    onChange={this.onChange}
                    value={value[1]}
                    targetDate={value[0]}
                />
            </div>
        );
    }
}

export default DateRange;

export * from './types';
