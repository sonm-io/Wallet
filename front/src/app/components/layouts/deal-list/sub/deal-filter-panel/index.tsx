import * as React from 'react';
import * as cn from 'classnames';
import {
    DateRangeDropdown,
    TDateRangeValue,
} from 'app/components/common/date-range-dropdown';
import { Input } from 'app/components/common/input';
import Toggler from 'app/components/common/toggler';
import { IChangeParams } from 'app/components/common/types';

interface IDealFilter {
    query: string;
    dateRange: TDateRangeValue;
    onlyActive: boolean;
}

export interface IDealFilterPanelProps extends IDealFilter {
    className?: string;
    onUpdateFilter: (
        key: keyof IDealFilter,
        value: IDealFilter[keyof IDealFilter],
    ) => void;
}

export class DealFilterPanel extends React.Component<
    IDealFilterPanelProps,
    never
> {
    constructor(props: IDealFilterPanelProps) {
        super(props);
    }

    protected handleChangeInput = (
        params: IChangeParams<string | boolean | TDateRangeValue>,
    ) => {
        const key = params.name as keyof IDealFilter;
        const value: IDealFilter[keyof IDealFilter] = params.value;
        this.props.onUpdateFilter(key, value);
    };

    public render() {
        return (
            <div className={cn('deal-filter-panel', this.props.className)}>
                <DateRangeDropdown
                    name="dateRange"
                    className="deal-filter-panel__date-range"
                    value={this.props.dateRange}
                    onChange={this.handleChangeInput}
                    disabled
                />
                <Input
                    name="search-by-address"
                    placeholder="Search by address"
                    onChange={this.handleChangeInput}
                    className="deal-filter-panel__query"
                    value={this.props.query}
                    disabled
                />
                <Toggler
                    name="deals-active"
                    className="deal-filter-panel__active"
                    title="Only active"
                    value={this.props.onlyActive}
                    onChange={this.handleChangeInput}
                    disabled
                />
            </div>
        );
    }
}
