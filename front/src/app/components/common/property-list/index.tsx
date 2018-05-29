import * as React from 'react';
import * as cn from 'classnames';

export type IDictionary<T> = { [P in keyof T]?: any };

export interface IPropertyItemConfig<T = string> {
    name: string;
    key: T;
    render?: (value: any) => string;
}

interface IPropertyListProps<T> {
    className?: string;
    dataSource: IDictionary<T>;
    config: Array<IPropertyItemConfig<keyof T>>;
}

export class PropertyList<T = any> extends React.Component<
    IPropertyListProps<T>,
    never
> {
    public render() {
        const p: IPropertyListProps<T> = this.props;

        return (
            <div className={cn(p.className, `sonm-property-list`)}>
                {p.config.map(({ name, key, render }) => {
                    const value =
                        p.dataSource[key] !== undefined
                            ? p.dataSource[key]
                            : '';
                    return (
                        <React.Fragment key={name}>
                            <div className="sonm-property-list__label">
                                {name}
                            </div>
                            <div className="sonm-property-list__value">
                                {render ? render(value) : value}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
}

export default PropertyList;
