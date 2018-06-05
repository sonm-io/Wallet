import * as React from 'react';
import * as cn from 'classnames';
import { DropdownInput } from '../dropdown-input';

export interface ISelectItem<T> {
    value: T;
    stringValue: any;
    className?: string;
}

export interface ISelectChangeParams<T> extends ISelectItem<T> {
    name: string;
    prev?: ISelectItem<T>;
}

export interface ISelectProps<T> {
    className?: string;
    options: Array<ISelectItem<T>>;
    value: T;
    name: string;
    hasBalloon?: boolean;
    onChange: (params: ISelectChangeParams<T>) => void;
    compareValues?: (a: T, b: T) => boolean;
    disabled?: boolean;
}

export class FixedSelect<T> extends React.PureComponent<ISelectProps<T>, any> {
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

    protected static asString(valueString: any, value: any) {
        return typeof valueString === 'string'
            ? valueString
            : JSON.stringify(value);
    }

    protected handleSelect = (event: any) => {
        const p = this.props;
        const prev = p.options.find(x => x.value === p.value);
        const stringValue = event.currentTarget.value;
        const next = p.options.find(
            x => FixedSelect.asString(x.stringValue, x.value) === stringValue,
        ) as ISelectItem<T>;

        if (p.onChange) {
            p.onChange({
                prev,
                name: p.name,
                value: next.value,
                stringValue,
            });
        }

        this.setState({
            expanded: false,
        });
    };

    protected static compareValues<T>(a: T, b: T) {
        return a === b;
    }

    public static compareAsJson<T>(a: T, b: T) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    public getSnapshotBeforeUpdate(
        prevProps: ISelectProps<T>,
        prevState: any,
    ): any {
        const keepFocus =
            this.rootRef.rootNodeRef.querySelector(':focus') !== null;

        return { keepFocus };
    }

    public componentDidUpdate(p: any, s: any, snapshot: any) {
        if (snapshot && snapshot.keepFocus) {
            this.rootRef.focus();
        }
    }

    protected rootRef: any;
    protected saveRef = (ref: any) => (this.rootRef = ref);

    public render() {
        const p = this.props;
        const { value, className, options, hasBalloon } = p;
        const compareValues = p.compareValues || FixedSelect.compareValues;
        const current = options.find(x => compareValues(value, x.value));

        return (
            <DropdownInput
                className={cn(className, 'sonm-fixed-select')}
                valueString={current ? current.stringValue : '[No value]'}
                onRequireClose={this.handleClose}
                onButtonClick={this.handleButtonClick}
                isExpanded={this.state.expanded}
                hasBalloon={hasBalloon}
                ref={this.saveRef}
                disabled={this.props.disabled}
            >
                {options.map((x: ISelectItem<T>, idx: number) => {
                    return (
                        <button
                            type="button"
                            key={idx}
                            value={FixedSelect.asString(x.stringValue, x.value)}
                            className={cn(
                                'sonm-fixed-select__item',
                                x.className,
                            )}
                            onClick={this.handleSelect}
                        >
                            {x.stringValue}
                        </button>
                    );
                })}
            </DropdownInput>
        );
    }
}

export default FixedSelect;
