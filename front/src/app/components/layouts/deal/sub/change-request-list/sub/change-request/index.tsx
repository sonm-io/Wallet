import * as React from 'react';
import * as cn from 'classnames';
import {
    IDealComparableParams,
    IDealChangeRequest,
    EnumChangeRequestSide,
    EnumOrderSide,
    TChangeRequestAction,
} from 'app/api/types';
import { ChangeRequestParam } from '../change-request-param';
import { BalanceUtils } from 'app/components/common/balance-view/utils';
import { BN } from 'bn.js';
import Button from 'app/components/common/button';
import { getPricePerHour } from 'app/components/common/price-per-hour/utils';

export interface IChangeRequestProps {
    className?: string;
    dealParams: IDealComparableParams;
    request: IDealChangeRequest;
    side: EnumChangeRequestSide;
    onCancel: TChangeRequestAction;
    onChange: TChangeRequestAction;
    onReject: TChangeRequestAction;
    onAccept: TChangeRequestAction;
}

export class ChangeRequest extends React.Component<IChangeRequestProps, never> {
    constructor(props: IChangeRequestProps) {
        super(props);
    }

    protected formatPrice = (price: string) =>
        BalanceUtils.formatBalance(getPricePerHour(price), 4, 18, true) +
        ' USD/h';

    protected formatDuration = (duration: number) => {
        const value = (duration / 3600).toString();
        return BalanceUtils.formatBalance(value, 1, 0, true) + ' h';
    };

    protected isGreater = (a: string, b: string) => new BN(a).gt(new BN(b));

    protected get hasPriceAdvantage(): boolean {
        const p = this.props;
        const requestPrice = p.request.price || '';

        const mySide = p.side === EnumChangeRequestSide.mySide;
        const buy = p.request.requestType === EnumOrderSide.buy;

        let result = this.isGreater(p.dealParams.price, requestPrice);

        result = buy ? result : !result;
        result = mySide ? result : !result;
        return result;
    }

    protected handleClickButton = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        const id = this.props.request.id;
        switch (event.currentTarget.name) {
            case 'cancel':
                this.props.onCancel(id);
                break;
            case 'change':
                this.props.onChange(id);
                break;
            case 'reject':
                this.props.onReject(id);
                break;
            case 'accept':
                this.props.onAccept(id);
                break;
        }
    };

    public render() {
        const p = this.props;
        return (
            <div className={cn('change-request', this.props.className)}>
                <div className="change-request__side">
                    {p.request.requestType === EnumOrderSide.buy
                        ? 'Customer'
                        : 'Supplier'}
                </div>
                {p.request.price ? (
                    <ChangeRequestParam
                        name="Price change"
                        className="change-request__param"
                        initialValue={this.formatPrice(p.dealParams.price)}
                        changedValue={this.formatPrice(p.request.price)}
                        hasAdvantage={this.hasPriceAdvantage}
                    />
                ) : null}
                {p.request.duration ? (
                    <ChangeRequestParam
                        name="Duration change"
                        className="change-request__param"
                        initialValue={this.formatDuration(
                            p.dealParams.duration,
                        )}
                        changedValue={this.formatDuration(
                            parseInt(p.request.duration, 10),
                        )}
                    />
                ) : null}
                {p.side === EnumChangeRequestSide.mySide ? (
                    <React.Fragment>
                        <Button
                            name="cancel"
                            className="change-request__button"
                            transparent
                            color="gray"
                            onClick={this.handleClickButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            name="change"
                            className="change-request__button"
                            transparent
                            color="violet"
                            onClick={this.handleClickButton}
                        >
                            Change
                        </Button>
                    </React.Fragment>
                ) : null}
                {p.side === EnumChangeRequestSide.otherSide ? (
                    <React.Fragment>
                        <Button
                            name="reject"
                            className="change-request__button"
                            transparent
                            color="pink"
                            onClick={this.handleClickButton}
                        >
                            Reject
                        </Button>
                        <Button
                            name="accept"
                            className="change-request__button"
                            transparent
                            color="green"
                            onClick={this.handleClickButton}
                        >
                            Accept
                        </Button>
                    </React.Fragment>
                ) : null}
            </div>
        );
    }
}
