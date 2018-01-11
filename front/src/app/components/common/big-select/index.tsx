import * as React from 'react';
import Select, { SelectProps } from 'antd/es/select';

import * as cn from 'classnames';

export class BigSelect extends React.Component<SelectProps, any> {
    public render() {
        return (
            <Select
                {...this.props}
                notFoundContent="Nothing to show"
                className={cn('sonm-big-select', this.props.className)}
                dropdownClassName="sonm-big-select__dropdown"
                optionFilterProp="value"
            />
        );
    }
}

export const { Option } = Select;
