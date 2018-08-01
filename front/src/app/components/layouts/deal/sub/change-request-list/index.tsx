import * as React from 'react';
import * as cn from 'classnames';
import { ChangeRequest } from './sub/change-request';
import {
    IDealChangeRequest,
    IDealComparableParams,
    EnumOrderSide,
    TChangeRequestAction,
    EnumChangeRequestSide,
} from 'app/api/types';
import Button from 'app/components/common/button';

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
        this.props.requests
            .slice(0)
            .sort(
                (a: IDealChangeRequest, b: IDealChangeRequest) =>
                    a.requestType === this.props.mySide ? -1 : 1,
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
                            <Button
                                className="change-request-list__create-button"
                                onClick={p.onCreateRequest}
                            >
                                Create
                            </Button>
                        </div>
                    ) : null}
                    {this.getSortedRequests().map(i => (
                        <ChangeRequest
                            className="change-request-list__item"
                            key={i.id}
                            dealParams={p.dealParams}
                            request={i}
                            side={
                                p.mySide === i.requestType
                                    ? EnumChangeRequestSide.mySide
                                    : EnumChangeRequestSide.otherSide
                            }
                            onCancel={p.onCancelRequest}
                            onChange={p.onChangeRequest}
                            onReject={p.onRejectRequest}
                            onAccept={p.onAcceptRequest}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
