import * as React from 'react';
import * as cn from 'classnames';
import { KycListItem } from './sub/kyc-list-item';
import { IKycValidator } from 'app/api';

export interface IKycListViewProps {
    className?: string;
    list: Array<IKycValidator>;
    kycLinks: { [kycEthAddress: string]: string };
    validationMessage?: string;
    /**
     * Index of selected item. If undefined, then no one is selected.
     */
    selectedIndex?: number;
    onClickItem: (index: number) => void;
    /**
     * Called when bottom component (confirmation panel or link panel) is closed
     */
    onCloseBottom: () => void;
    onSubmitPassword: (itemIndex: number, password: string) => void;
}

export class KycListView extends React.Component<IKycListViewProps, never> {
    constructor(props: IKycListViewProps) {
        super(props);
    }

    public render() {
        return (
            <div className={cn('kyc-list', this.props.className)}>
                {this.props.list.map((i, index) => {
                    const kycLink = this.props.kycLinks[i.id];
                    return (
                        <KycListItem
                            className="kyc-list__item"
                            index={index}
                            key={index}
                            validator={i}
                            kycLink={kycLink}
                            validationMessage={this.props.validationMessage}
                            isSelected={this.props.selectedIndex === index}
                            onClick={this.props.onClickItem}
                            onSubmitPassword={this.props.onSubmitPassword}
                            onCancelPassword={this.props.onCloseBottom}
                            onCloseLink={this.props.onCloseBottom}
                        />
                    );
                })}
            </div>
        );
    }
}
