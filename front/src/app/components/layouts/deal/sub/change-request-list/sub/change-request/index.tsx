import * as React from 'react';
import * as cn from 'classnames';
import {
    IDealComparableParams,
    IDealChangeRequest,
    EnumChangeRequestState,
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
    state: EnumChangeRequestState;
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
                    {p.request.requestType === EnumOrderSide.bid
                        ? 'Customer'
                        : 'Supplier'}
                </div>
                {p.request.price ? (
                    <ChangeRequestParam
                        name="Price change"
                        className="change-request__param"
                        initialValue={this.formatPrice(p.dealParams.price)}
                        changedValue={this.formatPrice(p.request.price)}
                        hasAdvantage={this.isGreater(
                            p.dealParams.price,
                            p.request.price,
                        )}
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
                        hasAdvantage={
                            parseInt(p.request.duration, 10) >
                            p.dealParams.duration
                        }
                    />
                ) : null}
                {p.state === EnumChangeRequestState.mySide ? (
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
                {p.state === EnumChangeRequestState.otherSide ? (
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
