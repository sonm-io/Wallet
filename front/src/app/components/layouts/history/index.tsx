import * as React from 'react';
// import { Table } from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';

interface IProps {
    className?: string;
}

@inject('historyStore')
@observer
export class History extends React.Component<IProps, any> {

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={cn('sonm-history', className)}>
            </div>
        );
    }
}
