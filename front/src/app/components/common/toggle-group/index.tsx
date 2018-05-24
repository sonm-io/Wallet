import * as React from 'react';
import * as get from 'lodash/fp/get';
import * as cn from 'classnames';
import { IChengableProps, IChangeParams, ITogglerBaseProps } from '../types';
import { Toggler } from '../toggler';

let uniqIdx = 0;
function nextUniqId() {
    return 'toggleGroupId' + uniqIdx++;
}

export interface IToggleGroupBaseProps<TValue> extends IChengableProps<TValue> {
    values: TValue[];
    titlesOrDisplayIndex?: string[] | string;
    displayIndex?: string;
    className?: string;
    elementClassName?: string;
}

export interface IToggleGroupProps<TValue>
    extends IToggleGroupBaseProps<TValue> {
    elementCtor?:
        | React.ComponentClass<ITogglerBaseProps>
        | React.SFC<ITogglerBaseProps>;
}

export interface IState<TValue> {
    titlesOrDisplayIndex: string[] | string;
    titleGetter: (value: TValue, idx: number) => string;
}

export class ToggleGroup<TValue> extends React.Component<
    IToggleGroupProps<TValue>,
    IState<TValue>
> {
    public state: IState<TValue> = {
        titlesOrDisplayIndex: '',
        titleGetter: String,
    };

    public static defaultProps = {
        elementCtor: Toggler,
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
                state.titleGetter = (_: TValue, idx: number) =>
                    nextProps.titlesOrDisplayIndex
                        ? nextProps.titlesOrDisplayIndex[idx]
                        : String(nextProps.values[idx]);
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
        const { elementCtor, value, className, elementClassName } = this.props;
        const Tag = elementCtor;

        if (Tag === undefined) {
            return null;
        }

        return (
            <div className={cn('sonm-button-group', className)}>
                {this.props.values.map((current, index) => {
                    const name = this.state.titleGetter(current, index);
                    return (
                        <Tag
                            key={name}
                            className={elementClassName}
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
