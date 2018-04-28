import * as React from 'react';
import * as cn from 'classnames';

export interface ICrumb {
    title: string;
    path: string;
}

export interface IBreadCrumbsProps {
    items: Array<ICrumb>;
    onNavigate: (path: string) => void;
    className?: string;
}

export class BreadCrumbs extends React.Component<IBreadCrumbsProps, any> {
    public render() {
        const p = this.props;
        let url = '';

        return (
            <div className={cn('sonm-breadcrumbs', p.className)}>
                {p.items.reverse().map((c: ICrumb, idx: number) => {
                    url += c.path;

                    return idx === p.items.length - 1 ? (
                        <a
                            key={c.path}
                            href={url}
                            className="sonm-breadcrumbs__items"
                        >
                            {c.title}
                        </a>
                    ) : (
                        <span
                            key={c.path}
                            className="sonm-breadcrumbs__items--last"
                        >
                            {c.title}
                        </span>
                    );
                })}
            </div>
        );
    }
}

export default BreadCrumbs;
