import * as React from 'react';
import * as get from 'lodash/fp/get';
import * as cn from 'classnames';
import { IChengableProps, IChangeParams, ITogglerBaseProps } from '../types';
import { Toggler } from '../toggler';

let uniqIdx = 0;
function nextUniqId() {
    return 'toggleGroupId' + uniqIdx++;
}

export interface IToggleGroupProps<TValue> extends IChengableProps<TValue> {
    values: TValue[];
    titlesOrDisplayIndex?: string[] | string;
    displayIndex?: string;
    className?: string;
    cssClasses?: IToggleGroupCssClasses;
    elementCtor?:
        | React.ComponentClass<ITogglerBaseProps>
        | React.SFC<ITogglerBaseProps>;
}

export interface IState<TValue> {
    titlesOrDisplayIndex: string[] | string;
    titleGetter: (value: TValue, idx: number) => string;
}

export interface IToggleGroupCssClasses {
    item: string;
    container: string;
}

export class ToggleGroup<TValue> extends React.Component<
    IToggleGroupProps<TValue>,
    IState<TValue>
> {
    public static readonly defaultCssClasses: IToggleGroupCssClasses = {
        item: 'sonm-button-group__item',
        container: 'sonm-button-group',
    };

    public static readonly fullWidthCssClasses: IToggleGroupCssClasses = {
        item: 'sonm-full-width-group__item',
        container: 'sonm-full-width-group',
    };

    public static readonly radioRowCssClasses: IToggleGroupCssClasses = {
        item: 'sonm-radio-row-group__item',
        container: 'sonm-radio-row-group',
    };

    public state: IState<TValue> = {
        titlesOrDisplayIndex: '',
        titleGetter: String,
    };

    public static defaultProps = {
        elementCtor: Toggler,
        cssClasses: ToggleGroup.defaultCssClasses,
    };

    public static getDerivedStateFromProps<TValue>(
        nextProps: IToggleGroupProps<TValue>,
        prevState: IState<TValue>,
    ) {
        const state: Partial<IState<TValue>> = {};

        if (nextProps.titlesOrDisplayIndex !== prevState.titlesOrDisplayIndex) {
            if (typeof nextProps.titlesOrDisplayIndex === 'string') {
                state.titleGetter = get(nextProps.titlesOrDisplayIndex);
            } else if (Array.isArray(nextProps.titlesOrDisplayIndex)) {
                state.titleGetter = (value: TValue, idx: number) =>
                    nextProps.titlesOrDisplayIndex !== undefined
                        ? nextProps.titlesOrDisplayIndex[idx]
                        : String(value);
            } else {
                state.titleGetter = String;
            }

            state.titlesOrDisplayIndex = nextProps.titlesOrDisplayIndex;
        }

        return state;
    }

    protected uid = nextUniqId();

    protected getValueByName(name: string): TValue {
        return this.props.values.find((x: TValue, idx) => {
            const current = this.state.titleGetter(x, idx);
            return current === name;
        }) as TValue;
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
        const { elementCtor, value, className, cssClasses } = this.props;
        const Tag = elementCtor;

        if (Tag === undefined) {
            return null;
        }

        return (
            <div
                className={cn(
                    (cssClasses as IToggleGroupCssClasses).container,
                    className,
                )}
            >
                {this.props.values.map((current, index) => {
                    const name = this.state.titleGetter(current, index);
                    return (
                        <Tag
                            key={name}
                            className={
                                (cssClasses as IToggleGroupCssClasses).item
                            }
                            title={name}
                            name={name}
                            groupName={
                                this.props.name === undefined
                                    ? this.uid
                                    : this.props.name
                            }
                            value={current === value}
                            onChange={this.handleChange}
                        />
                    );
                })}
            </div>
        );
    }
}

export default ToggleGroup;
