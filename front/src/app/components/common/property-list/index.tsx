import * as React from 'react';
import * as cn from 'classnames';

export type IDictionary<T> = { [P in keyof T]?: any };

export interface IPropertyListCssClasses {
    root: string;
    label: string;
    value: string;
    header: string;
}

export interface IPropertyItemConfig<T = string, TData = any> {
    name: string;
    key: T;
    render?: (value: any, dataSource: IDictionary<TData>) => React.ReactNode;
}

interface IPropertyListProps<T> {
    className?: string;
    dataSource: IDictionary<T>;
    config: Array<IPropertyItemConfig<keyof T | undefined, T>>;
    title?: string;
    cssClasses?: Partial<IPropertyListCssClasses>;
}

export class PropertyList<T = any> extends React.Component<
    IPropertyListProps<T>,
    never
> {
    public static readonly renders = {
        booleanYesNo: (value: boolean): string => (value ? 'Yes' : 'No'),
    };

    protected static defaultCssClasses: IPropertyListCssClasses = {
        root: 'property-list',
        label: 'property-list__label',
        value: 'property-list__value',
        header: 'property-list__header',
    };

    public render() {
        const p: IPropertyListProps<T> = this.props;
        const cssClasses = p.cssClasses || PropertyList.defaultCssClasses;
        return (
            <div
                className={cn(cssClasses.root, p.className)}
                {...{ 'data-display-id': `prop-list` }}
            >
                {p.title ? (
                    <h4 className={cssClasses.header}>{p.title}</h4>
                ) : null}
                {p.config.map(({ name, key, render }) => {
                    const value =
                        key !== undefined && p.dataSource[key] !== undefined
                            ? p.dataSource[key]
                            : '';
                    return (
                        <React.Fragment key={name}>
                            <div className={cssClasses.label}>{name}</div>
                            <div className={cssClasses.value}>
                                {render
                                    ? render(value, p.dataSource)
                                    : String(value)}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
}

export default PropertyList;
