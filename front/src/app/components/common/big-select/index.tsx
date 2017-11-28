import * as React from 'react';
import { Select  } from 'antd';
import { SelectProps } from 'antd/lib/select';

import * as cn from 'classnames';

export class BigSelect extends React.Component<SelectProps, any> {
    public render() {
        return (
            <Select
                {...this.props}
                className={cn('sonm-big-select', this.props.className)}
                dropdownClassName="sonm-big-select__dropdown"
                optionFilterProp="value"
            />
        );
    }
}

export const { Option } = Select;
