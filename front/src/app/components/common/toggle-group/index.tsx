import * as React from 'react';
import * as get from 'lodash/fp/get';
import * as cn from 'classnames';
import { IChengable, IChengableProps, IChangeParams } from '../types';

const toString = (x: any) => String(x);
const id = (x: any) => x;

let uniqIdx = 0;
function nextUniqId() {
    return 'toggleGroupId' + uniqIdx++;
}

export interface IToggleGroupItem extends IChengableProps<boolean> {
    className?: string;
    title?: string;
    groupName?: string;
}

export interface IToggleGroupProps<
    TValue,
    TElement extends React.Component<IToggleGroupItem, never>
> extends IChengableProps<TValue> {
    values: TValue[];
    titles?: string[] | string;
    className?: string;
    elementClassName?: string;
    elementCtor: new () => TElement;
}

export class ToggleGroup<
    TValue,
    TElement extends React.Component<IToggleGroupItem, never>
> extends React.Component<IToggleGroupProps<TValue, TElement>, any>
    implements IChengable<TValue> {
    constructor(props: IToggleGroupProps<TValue, TElement>) {
        super(props);

        this.groupName = this.props.name || nextUniqId();

        this.titleGetter =
            typeof props.titles === 'string'
                ? get(props.titles)
                : props.titles === undefined
                    ? toString
                    : id;
    }

    private groupName: string;

    private titleGetter: (value: TValue) => string;

    protected getValueByName(name: string) {
        if (this.props.titles instanceof Array) {
            const index = this.props.titles.findIndex(i => i === name);
            return this.props.values[index];
        } else {
            const res = this.props.values.find(
                i => this.titleGetter(i) === name,
            ) as TValue;
            return res;
        }
    }

    protected getNameByIndex(index: number) {
        return this.props.titles instanceof Array
            ? this.props.titles[index]
            : this.titleGetter(this.props.values[index]);
    }

    protected handleChange = (params: IChangeParams<boolean>) => {
        if (params.value === false) {
            return;
        }

        const value = this.getValueByName(params.name);

        if (this.props.onChange) {
            this.props.onChange({
                name: this.props.name,
                value,
                stringValue: value.toString(),
            });
        }
    };

    public render() {
        const { elementCtor, value, className, elementClassName } = this.props;
        const Tag = elementCtor;

        return (
            <div className={cn('sonm-button-group', className)}>
                {this.props.values.map((key, index) => {
                    const name = this.getNameByIndex(index);
                    return (
                        <Tag
                            key={this.titleGetter(key)}
                            className={elementClassName}
                            title={name}
                            name={name}
                            groupName={this.groupName}
                            value={key === value}
                            onChange={this.handleChange}
                        />
                    );
                })}
            </div>
        );
    }
}

export default ToggleGroup;
