import * as React from 'react';
import { AccountItem, IAccountItemProps } from 'app/components/common/account-item';

export function DeleteAccountConfirmation(props: IAccountItemProps) {
    return <div className="sonm-account-delete-confirmation">
        <h4 className="sonm-account-delete-confirmation__header">Are you sure want to delete?</h4>
        <AccountItem
            key="del-preview"
            address={props.address}
            name={props.name}
            firstBalance={props.firstBalance}
            secondBalance={props.secondBalance}
        />
    </div>;
}

export default DeleteAccountConfirmation;
