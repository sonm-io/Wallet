import * as React from 'react';
import * as cn from 'classnames';

interface IProps {
    className?: string;
    title?: string;
    children: any;
}

export class Panel extends React.Component<IProps, any> {
    public render() {
        return (
            <div className={cn('sonm-panel', this.props.className)}>
                <h2 className="sonm-panel__title">{this.props.title}</h2>
                {this.props.children}
            </div>
        );
    }
}

export default Panel;
