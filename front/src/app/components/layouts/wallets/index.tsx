import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import * as api from 'app/api';

interface IProps {
    className?: string;
    children?: any;
}

@inject('Store')
@observer
export class Wallets extends React.Component<IProps, any> {
    public render() {

        api.methods.ping().then ((response: api.IResponse) => {
            //console.log(response);
        });

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
