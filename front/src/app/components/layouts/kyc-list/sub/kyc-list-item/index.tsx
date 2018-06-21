import * as React from 'react';
import { IKycListItemProps } from './types';
import ProfileStatus from 'app/components/common/profile-status';
import Balance from 'app/components/common/balance-view';
import Button from 'app/components/common/button';
import * as cn from 'classnames';

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
        alert(1);
    };

    public render() {
        const p = this.props;
        return (
            <div className={cn('kyc-list-item', p.className)}>
                <img
                    className="kyc-list-item__icon"
                    src={KycListItem.imgPrefix + p.iconBase64}
                />
                <h3 className="kyc-list-item__title">{p.title}</h3>
                <div className="kyc-list-item__descr">{p.description}</div>
                <Status status={p.profileStatus} />
                <Price price={p.price} />
                <Button
                    className="kyc-list-item__btn"
                    onClick={this.handleClickSelect}
                >
                    Select
                </Button>
                <span className="kyc-list-item__line" />
            </div>
        );
    }
}
