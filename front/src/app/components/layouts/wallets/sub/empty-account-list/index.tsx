import * as React from 'react';

export interface IProps {
    className?: string;
}

export class EmptyAccountList extends React.Component<IProps, any> {
    public render() {

        return (
            <div className="sonm-wallets-empty-list">
                <h3>Welcome to SONM Wallet!</h3>
                Please add accounts to display. Click button below and follow instructions
            </div>
        );
    }
}

export default EmptyAccountList;
