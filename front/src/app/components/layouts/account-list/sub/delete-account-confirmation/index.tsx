import * as React from 'react';
import {
    AccountItem,
    IAccountItemProps,
} from 'app/components/common/account-item';

export function DeleteAccountConfirmation(props: IAccountItemProps) {
    return (
        <div className="sonm-account-delete-confirmation">
            <h4 className="sonm-account-delete-confirmation__header">
                Are you sure you want to delete this account?
            </h4>
            <AccountItem
                key="del-preview"
                account={props.account}
                primaryTokenInfo={props.primaryTokenInfo}
            />
        </div>
    );
}

export default DeleteAccountConfirmation;
