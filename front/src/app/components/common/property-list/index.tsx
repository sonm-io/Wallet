import * as React from 'react';
import * as cn from 'classnames';
import { IDictionary } from 'app/api/types';

export interface IPropertyListItem {
    name: string;
    key: string;
    render?: (value: string) => string;
}

interface IPropertyListProps {
    className?: string;
    dataSource: IDictionary;
    config: IPropertyListItem[];
}

export function PropertyList(p: IPropertyListProps) {
    return (
        <div className={cn(p.className, `sonm-property-list`)}>
            {p.config.map(({ name, key, render }, idx) => {
                const value =
                    p.dataSource[key as keyof IDictionary] !== undefined
                        ? p.dataSource[key as keyof IDictionary]
                        : '';
                return (
                    <React.Fragment key={name}>
                        <div className="sonm-property-list__label">{name}</div>
                        <div className="sonm-property-list__value">
                            {render ? render(value.toString()) : value}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default PropertyList;
