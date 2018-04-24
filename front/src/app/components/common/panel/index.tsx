import * as React from 'react';
import * as cn from 'classnames';

interface IProps {
    className?: string;
    title?: string;
    children: any;
    style?: any;
}

export class Panel extends React.Component<IProps, never> {
    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-panel', p.className)} style={p.style}>
                <h2 className="sonm-panel__title">{p.title}</h2>
                {p.children}
            </div>
        );
    }
}

export default Panel;
