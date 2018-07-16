import * as React from 'react';
import * as cn from 'classnames';

export type IDictionary<T> = { [P in keyof T]?: any };

export interface IPropertyListCssClasses {
    root: string;
    label: string;
    value: string;
    header: string;
}

interface IConfigItemBase {
    /**
     * If name is not specified then show id as name.
     */
    name?: string;
}

interface IConfigItemWithKey<TData> extends IConfigItemBase {
    type?: 'single';
    id: keyof TData;
    renderValue?: (value: any) => React.ReactNode;
}

interface IConfigItemWithRender<TData, TId> extends IConfigItemBase {
    type: 'composite';
    id?: TId;
    render: (data: TData) => React.ReactNode;
}

export type IPropertyItemConfig<TData = any, TId = never> =
    | IConfigItemWithKey<TData>
    | IConfigItemWithRender<TData, TId>;

interface IPropertyListProps<
    TData extends IDictionary<TData> = any,
    TId = never
> {
    className?: string;
    data: TData;
    config: Array<IPropertyItemConfig<TData, TId>>;
    title?: string;
    cssClasses?: Partial<IPropertyListCssClasses>;
}

export class PropertyList<TData = any, TId = never> extends React.Component<
    IPropertyListProps<TData, TId>,
    never
> {
    public static readonly renderers = {
        booleanYesNo: (value: boolean): string => (value ? 'Yes' : 'No'),
    };

    protected static defaultCssClasses: IPropertyListCssClasses = {
        root: 'property-list',
        label: 'property-list__label',
        value: 'property-list__value',
        header: 'property-list__header',
    };

    protected static toStr = (value: any) =>
        value === undefined ? '' : String(value);

    public render() {
        const p = this.props;
        const cssClasses = p.cssClasses || PropertyList.defaultCssClasses;
        return (
            <div
                className={cn(cssClasses.root, p.className)}
                {...{ 'data-display-id': `prop-list` }}
            >
                {p.title ? (
                    <h4 className={cssClasses.header}>{p.title}</h4>
                ) : null}
                {p.config.map(configItem => {
                    const name = configItem.name || String(configItem.id);
                    const value =
                        configItem.type === 'composite'
                            ? configItem.render(p.data)
                            : configItem.renderValue
                                ? configItem.renderValue(p.data[configItem.id])
                                : PropertyList.toStr(p.data[configItem.id]);

                    return (
                        <React.Fragment key={name}>
                            <div className={cssClasses.label}>{name}</div>
                            <div className={cssClasses.value}>{value}</div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
}

export default PropertyList;
