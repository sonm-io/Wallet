import * as React from 'react';
import * as cn from 'classnames';
import { IKycListItemProps } from './sub/kyc-list-item/types';

export interface IKycListViewProps {
    className?: string;
    list: Array<IKycListItemProps>;
}

export class KycListView extends React.Component<IKycListViewProps, never> {
    constructor(props: IKycListViewProps) {
        super(props);
    }

    public render() {
        return (
            <div className={cn('kyc-list', this.props.className)}>hello</div>
        );
    }
}
