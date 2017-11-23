import * as React from 'react';
import {} from 'antd';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import * as api from 'app/api';

interface IProps {
    className?: string;
}

@inject('Store')
@observer
export class Wallets extends React.Component<IProps, any> {

    public render() {
        const {
            className,
        } = this.props;

        api.methods.ping().then (async (response: api.IResponse) => {
            console.log(response);

            const response1 = await api.methods.setSecretKey('my secret key');
            console.log(response1);

            const response2 = await api.methods.getAccountList();
            console.log(response2);
        });

        return (
            <div className={cn('sonm-send', className)}>
                history
            </div>
        );
    }
}