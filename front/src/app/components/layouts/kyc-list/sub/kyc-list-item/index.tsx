import * as React from 'react';
import { IKycListItemProps, EnumKycListItemState } from './types';
import ProfileStatus from 'app/components/common/profile-status';
import Balance from 'app/components/common/balance-view';
import * as cn from 'classnames';
import { ConfirmationPanel } from '../../../../common/confirmation-panel';
import { KycLinkPanel } from '../kyc-link-panel';

const Status = ({ status }: any) => (
    <div className="kyc-list-item__status">
        <div className="kyc-list-item__label">Identification level</div>
        <ProfileStatus status={status} />
    </div>
);

const Price = ({ price }: any) => (
    <div className="kyc-list-item__price">
        <div className="kyc-list-item__label">Price</div>
        <Balance
            balance={price}
            decimalPointOffset={0} // ToDo GUI-179
            symbol="USD"
        />
    </div>
);

export class KycListItem extends React.Component<IKycListItemProps, never> {
    constructor(props: IKycListItemProps) {
        super(props);
    }

    protected static imgPrefix = 'data:image/png;base64,';

    protected handleClickSelect = () => {
        this.props.onClick(this.props.id);
    };

    // ToDo GUI-179: may be we can extract one generic method for all that takes id.

    protected handleSubmitPasword = (password: string) => {
        this.props.onSubmitPassword(this.props.id, password);
    };

    protected handleCancelPasword = () => {
        this.props.onCancelPassword(this.props.id);
    };

    protected handleCloseLink = () => {
        this.props.onCloseLink(this.props.id);
    };

    private get isSelected() {
        return (
            this.props.state === EnumKycListItemState.PasswordRequest ||
            this.props.state === EnumKycListItemState.ShowLink
        );
    }

    public render() {
        const p = this.props;
        return (
            <a
                className={cn('kyc-list-item', p.className, {
                    'kyc-list-item--selected': this.isSelected,
                })}
                onClick={this.handleClickSelect}
            >
                <img
                    className="kyc-list-item__icon"
                    src={KycListItem.imgPrefix + p.iconBase64}
                />
                <h3 className="kyc-list-item__title">{p.title}</h3>
                <div className="kyc-list-item__descr">{p.description}</div>
                <Status status={p.profileStatus} />
                <Price price={p.price} />

                {p.state === EnumKycListItemState.PasswordRequest ? (
                    <ConfirmationPanel
                        className="kyc-list-item__bottom"
                        labelHeader="Please, enter account password."
                        labelDescription=""
                        onSubmit={this.handleSubmitPasword}
                        onCancel={this.handleClickSelect}
                        validationMessage={p.validationMessage}
                    />
                ) : p.state === EnumKycListItemState.ShowLink ? (
                    <KycLinkPanel
                        className="kyc-list-item__bottom"
                        value={p.kycLink || ''}
                        onClose={this.handleCloseLink}
                    />
                ) : (
                    <span className="kyc-list-item__line" />
                )}
            </a>
        );
    }
}
