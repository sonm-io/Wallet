import * as React from 'react';
import { DropdownInput } from '../dropdown-input';
import { DateRange, IDateRangeProps, IDateRangeAllProps } from '../date-range';

export class DateRangeDropdown extends React.PureComponent<
    IDateRangeProps,
    any
> {
    public static defaultProps = DateRange.defaultProps;

    public state = {
        expanded: false,
    };

    protected handleButtonClick = () => {
        this.setState({
            expanded: !this.state.expanded,
        });
    };

    protected handleClose = () => {
        this.setState({
            expanded: false,
        });
    };

    protected getProps() {
        return this.props as IDateRangeAllProps;
    }

    public render() {
        const { value, className, valueToString } = this.getProps();

        return (
            <DropdownInput
                className={className}
                valueString={valueToString(value)}
                onRequireClose={this.handleClose}
                onButtonClick={this.handleButtonClick}
                isExpanded={this.state.expanded}
            >
                <DateRange {...this.props} className="" />
            </DropdownInput>
        );
    }
}

export default DateRangeDropdown;

export * from './types';
