import * as React from 'react';
import { default as RcSelect, Option as RcOption } from 'rc-select';
import * as get from 'lodash/fp/get';

import * as cn from 'classnames';

export interface ISelectCssClasses {
    select: string;
    option: string;
    dropdown: string;
}

const defaultClasses: ISelectCssClasses = {
    select: 'blackoselect',
    option: 'blackoselect__option',
    dropdown: 'blackoselect__dropdown',
}

export interface ISelectOnChangeParams<T> {
    name: string;
    option: T;
    value: string;
}

export interface ISelectProps<T> {
    className?: string;
    options: T[];
    keyIndex?: string;
    name: string;
    onChange: (params: ISelectOnChangeParams<T>) => void;
    render?: (item: T, keyIndex?: string) => any;
    classes?: ISelectCssClasses;
    value: string;
}

export class BlackSelect<T> extends React.Component<ISelectProps<T>, any> {
    protected getKey = this.props.keyIndex
        ? get(this.props.keyIndex)
        : (x: any) => x;

    public static defaultProps: Partial<ISelectProps<any>> = {
        classes: defaultClasses,
    }

    protected renderItem(record: T, key: string) {
        let result = null;

        if (this.props.render) {
            result = this.props.render(record, this.props.keyIndex);
        } else {
            const str = String(record);

            result = (str === '' || str === '[object Object]')
                ? key
                : str;
        }

        return result;
    }

    protected handleChange = (value: string) => {
        const option = this.props.options.find(x => this.getKey(x) === value);

        if (option) {
            this.props.onChange({
                value,
                option,
                name: this.props.name,
            });
        }
    }

    public render() {
        const s = (this.props.classes as ISelectCssClasses);
        const className = this.props.className;

        return (
            <RcSelect
                name={this.props.name}
                value={this.props.value}
                dropdownAlign={{ top: 0 }}
                prefixCls="sonm-select"
                onChange={this.handleChange}
                dropdownClassName={s.dropdown}
                className={cn(className, s.select)}
                optionLabelProp="children"
            >
                {this.props.options.map(
                    x => {
                        const key = String(this.getKey(x));

                        return (<RcOption value={key} key={key} className={s.option}>
                            {this.renderItem(x, key)}
                        </RcOption>);
                    },
                )}
            </RcSelect>
        );
    }
}

export default BlackSelect;
