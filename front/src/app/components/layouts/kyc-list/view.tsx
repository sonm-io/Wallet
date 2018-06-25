import * as React from 'react';
import * as cn from 'classnames';
import { IKycListItemProps } from './sub/kyc-list-item/types';
import { KycListItem } from './sub/kyc-list-item';

export interface IKycListViewProps {
    className?: string;
    list: Array<IKycListItemProps>;
    onSubmitPasword: (itemIndex: number, password: string) => void;
}

const emptyFn = () => {}; // ToDo GUI-179

export class KycListView extends React.Component<IKycListViewProps, never> {
    constructor(props: IKycListViewProps) {
        super(props);
    }

    public render() {
        return (
            <div className={cn('kyc-list', this.props.className)}>
                {this.props.list.map((i, index) => (
                    <KycListItem
                        className="kyc-list__item"
                        key={index}
                        state={0}
                        validationMessage=""
                        kycLink=""
                        onClick={emptyFn}
                        onSubmitPassword={emptyFn}
                        onCancelPassword={emptyFn}
                        onCloseLink={emptyFn}
                        {...i}
                    />
                ))}
            </div>
        );
    }
}
