import * as React from 'react';
import * as cn from 'classnames';

export class BreadCrumbs extends React.Component<any, any> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-breadcrumbs', p.className)}>
                Bread crumbs
            </div>
        );
    }
}

export default BreadCrumbs;
