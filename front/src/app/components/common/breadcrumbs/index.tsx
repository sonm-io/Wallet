import * as React from 'react';
import * as cn from 'classnames';

export type TCrumb = [string, string]; // title & path

export interface IBreadCrumbsProps {
    items: Array<TCrumb>;
    onNavigate: (path: string) => void;
    className?: string;
}

export class BreadCrumbs extends React.Component<IBreadCrumbsProps, any> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-breadcrumbs', p.className)}>
                {p.items.map(([title, url]) => (
                    <a key={url} href={url} className="sonm-breadcrumbs__items">
                        {title}
                    </a>
                ))}
            </div>
        );
    }
}

export default BreadCrumbs;
