import * as React from 'react';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';

interface IProps {
    className?: string;
}

@inject('Store')
@observer
export class Votes extends React.Component<IProps, any> {
    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={cn('sonm-send', className)}>
                votes
            </div>
        );
    }
}
