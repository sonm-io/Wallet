import * as React from 'react';
import get from 'lodash/fp/get';
import * as cn from 'classnames';
import { IToggle } from '../toggle-button/types';

const toString = (x: any) => String(x);

export interface IToggleGroupProps<TValue, TElement> {
    value?: TValue;
    valueList: TValue[];
    displayValuePath?: string;
    keyValuePath?: string;
    onChange?: (value: TValue) => void;
    className?: string;
    elementClassName?: string;
    name?: string;
    elementCtor: new () => TElement;
}

let uniqIdx = 0;
function nextUniqId() {
    return 'btnGrp' + uniqIdx++;
}

export class ToggleGroup<
    TValue,
    TElement extends React.Component<IToggle<TValue>, never>
> extends React.Component<IToggleGroupProps<TValue, TElement>, any> {
    private buttonGroupName: string;

    constructor(props: IToggleGroupProps<TValue, TElement>) {
        super(props);

        this.buttonGroupName =
            props.name === undefined ? nextUniqId() : props.name;
    }

    protected handleChange = (
        checked: boolean,
        value?: TValue,
        groupName?: string,
    ) => {
        if (checked === false) {
            return;
        }

        if (this.props.onChange) {
            this.props.onChange(value as TValue);
        }
    };

    private getDisplayValue(raw: any) {
        const getter =
            this.props.displayValuePath !== undefined
                ? get(this.props.displayValuePath)
                : toString;

        return getter(raw);
    }

    private getKeyValue(raw: any) {
        const getter =
            this.props.keyValuePath !== undefined
                ? get(this.props.keyValuePath)
                : toString;

        return getter(raw);
    }

    public render() {
        const { elementCtor, valueList, value, className } = this.props;
        const Tag = elementCtor;

        return (
            <div className={cn('sonm-button-group', className)}>
                {valueList.map(x => {
                    const key = this.getKeyValue(x);
                    return (
                        <Tag
                            className="elementClassName"
                            title={this.getDisplayValue(x)}
                            groupName={this.buttonGroupName}
                            value={key}
                            checked={key === value}
                            onChange={this.handleChange}
                        />
                    );
                })}
            </div>
        );
    }
}

export default ToggleGroup;
