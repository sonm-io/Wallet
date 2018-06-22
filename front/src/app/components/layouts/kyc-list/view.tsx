import * as React from 'react';
import * as cn from 'classnames';
import { IKycListItemProps } from './sub/kyc-list-item/types';
import { KycListItem } from './sub/kyc-list-item';

export interface IKycListViewProps {
    className?: string;
    list: Array<IKycListItemProps>;
    onClickSelect: (itemIndex: number) => void;
    onSubmitPasword: (itemIndex: number, password: string) => void;
}

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
                        {...i}
                    />
                ))}
            </div>
        );
    }
}
