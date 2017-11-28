import * as React from 'react';
import { IdentIcon } from '../ident-icon';
import * as cn from 'classnames';

export interface IAccountItemProps {
    className?: string;
    address: string;
    name: string;
    firstBalance: string;
    secondBalance: string;
}

export class AccountItem extends React.Component<IAccountItemProps, any> {
    public render() {
        const {
            className,
            address,
            name,
            firstBalance,
            secondBalance,
        } = this.props;

        return (
            <div className={cn('sonm-account-item', className)}>
                <IdentIcon address={address} className="sonm-account-item__blockies"/>
                <span className="sonm-account-item__name">{name}</span>
                <span className="sonm-account-item__ether">{firstBalance}</span>
                <span className="sonm-account-item__address">{address}</span>
                <span className="sonm-account-item__sonm">{secondBalance}</span>
            </div>
        );
    }

}

export default AccountItem;
