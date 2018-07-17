import * as React from 'react';
import * as cn from 'classnames';
import { EnumOrderSide } from 'app/api';
import { ChangeRequest, TChangeRequestAction } from './sub/change-request';
import {
    IDealChangeRequest,
    IDealComparableParams,
    EnumChangeRequestState,
} from './sub/change-request/types';
import Button from 'app/components/common/button';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';

export interface IChangeRequestListProps {
    className?: string;
    requests: IDealChangeRequest[];
    dealParams: IDealComparableParams;
    mySide: EnumOrderSide;

    // Request handlers:
    onCreateRequest: () => void;
    onCancelRequest: TChangeRequestAction;
    onChangeRequest: TChangeRequestAction;
    onRejectRequest: TChangeRequestAction;
    onAcceptRequest: TChangeRequestAction;

    // Confirmation panel:
    showConfirmation: boolean;
    validationMessage?: string;
    onSubmit: (password: string) => void;
    onConfirmationCancel: () => void;
}

export class ChangeRequestList extends React.Component<
    IChangeRequestListProps,
    never
> {
    constructor(props: IChangeRequestListProps) {
        super(props);
    }

    protected get isCreatePanelVisible() {
        const p = this.props;
        return (
            p.requests.length === 0 ||
            p.requests.every(r => r.requestType !== p.mySide)
        );
    }

    protected getSortedRequests = () =>
        this.props.requests.sort(
            (a: IDealChangeRequest, b: IDealChangeRequest) =>
                a.requestType === this.props.mySide
                    ? -1
                    : b.requestType === this.props.mySide
                        ? 1
                        : 0,
        );

    public render() {
        const p = this.props;
        return (
            <div className={cn('change-request-list', this.props.className)}>
                <div className="change-request-list__main">
                    <h3 className="change-request-list__header">
                        Change requests
                    </h3>
                    {this.isCreatePanelVisible ? (
                        <div className="change-request-list__item change-request-list__create-panel">
                            <div className="change-request-list__create-text">
                                You may create change request for the deal. Deal
                                conditions may be changed if counterparty will
                                accept it.
                            </div>
                            {p.showConfirmation === false ? (
                                <Button
                                    className="change-request-list__create-button"
                                    onClick={p.onCreateRequest}
                                >
                                    Create
                                </Button>
                            ) : null}
                        </div>
                    ) : null}
                    {this.getSortedRequests().map(i => (
                        <ChangeRequest
                            className="change-request-list__item"
                            key={i.id}
                            dealParams={p.dealParams}
                            request={i}
                            state={
                                p.showConfirmation
                                    ? EnumChangeRequestState.noButtons
                                    : p.mySide === i.requestType
                                        ? EnumChangeRequestState.mySide
                                        : EnumChangeRequestState.otherSide
                            }
                            onCancel={p.onCancelRequest}
                            onChange={p.onChangeRequest}
                            onReject={p.onRejectRequest}
                            onAccept={p.onAcceptRequest}
                        />
                    ))}
                </div>
                {p.showConfirmation ? (
                    <ConfirmationPanel
                        className="change-request-list__confirmation-panel"
                        validationMessage={p.validationMessage}
                        onSubmit={p.onSubmit}
                        onCancel={p.onConfirmationCancel}
                        labelHeader="Please, enter account password"
                        labelDescription=""
                        labelCancel="CANCEL"
                        labelSubmit="CONFIRM"
                    />
                ) : null}
            </div>
        );
    }
}
