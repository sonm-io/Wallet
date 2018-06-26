import * as React from 'react';
import * as cn from 'classnames';
import { KycListItem } from './sub/kyc-list-item';
import { IKycValidator } from 'app/api';

export interface IKycDataItem {
    kycLink?: string;
    validationMessage?: string;
}

export interface IKycData {
    [id: string]: IKycDataItem;
}

export interface IKycListViewProps {
    className?: string;
    list: Array<IKycValidator>;
    data: IKycData;
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

// interface IState {
//     selectedIndex?: number;
// }

export class KycListView extends React.Component<IKycListViewProps, never> {
    constructor(props: IKycListViewProps) {
        super(props);
        // this.state = {
        //     selectedIndex: undefined,
        // }
    }

    protected static emptyData: IKycDataItem = {
        kycLink: undefined,
        validationMessage: undefined,
    };

    // protected handleClick = (index: number) => {
    //     this.setState({ selectedIndex: index });
    // }

    // protected handleCancel = () => {
    //     this.setState({ selectedIndex: undefined });
    // }

    protected getDataItem = (id: string) => {
        const dataItem = this.props.data[id];
        return dataItem !== undefined ? dataItem : KycListView.emptyData;
    };

    public render() {
        return (
            <div className={cn('kyc-list', this.props.className)}>
                {this.props.list.map((i, index) => {
                    const { kycLink, validationMessage } = this.getDataItem(
                        i.id,
                    );
                    return (
                        <KycListItem
                            className="kyc-list__item"
                            index={index}
                            key={index}
                            validator={i}
                            kycLink={kycLink}
                            validationMessage={validationMessage}
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
