import * as React from 'react';
import { default as RcSelect, Option as RcOption } from 'rc-select';
import * as get from 'lodash/fp/get';

import * as cn from 'classnames';

export interface ISelectCssClasses {
    select: string;
    option: string;
    dropdown: string;
}

const _classes: ISelectCssClasses = {
    select: 'blackoselect',
    option: 'blackoselect__option',
    dropdown: 'blackoselect__dropdown',
}

export interface ISelectOnChangeParams<T> {
    name: string;
    value: T;
    key: string;
}

export interface ISelectProps<T> {
    className?: string;
    options: T[];
    keyIndex?: string;
    name: string;
    onChange: (params: ISelectOnChangeParams<T>) => void;
    render?: (item: T, keyIndex?: string) => any;
    classes?: ISelectCssClasses;
    value: T;
}

export class BlackSelect<T> extends React.Component<ISelectProps<T>, any> {
    protected getKey = this.props.keyIndex
        ? get(this.props.keyIndex)
        : (x: any) => x;

    public static defaultProps: Partial<ISelectProps<any>> = {
        classes: _classes,
    }

    protected renderItem(record: T) {
        const s = (this.props.classes as ISelectCssClasses);
        const key = String(this.getKey(record));
        let result = null;

        if (this.props.render) {
            result = this.props.render(record, this.props.keyIndex);
        } else {
            const str = String(record);

            result = (str === '' || str === '[object Object]')
                ? key
                : str;
        }

        return <RcOption value={key} key={key} className={s.option}>
            {result}
        </RcOption>;
    }

    protected handleChange = (key: string) => {
        const value = this.props.options.find(x => this.getKey(x) === key);

        if (value) {
            this.props.onChange({
                value,
                key,
                name: this.props.name,
            });
        }
    }

    public render() {
        const s = (this.props.classes as ISelectCssClasses);
        const className = this.props.className;

        return (
            <RcSelect
                value={this.props.value}
                dropdownAlign={{ top: 0 }}
                prefixCls="sonm-select"
                onChange={this.handleChange}
                dropdownClassName={s.dropdown}
                className={cn(className, s.select)}
            >
                {this.props.options.map(
                    x => this.renderItem(x),
                )}
            </RcSelect>
        );
    }
}

export default BlackSelect;
