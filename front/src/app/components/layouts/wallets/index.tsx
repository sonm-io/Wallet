import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';

interface IProps {
    className?: string;
    children?: any;
}

@inject('Store')
@observer
export class Wallets extends React.Component<IProps, any> {
    public render() {
        const {
            className,
            children,
        } = this.props;

        return (
            <div className={cn('sonm-send', className)}>
                wallets
                {children}
            </div>
        );
    }
}
