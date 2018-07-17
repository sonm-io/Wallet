import { EnumOrderSide } from 'app/api';

export interface IDealComparableParams {
    price: string;
    duration: number;
}

export enum EnumChangeRequestState {
    /**
     * This is my change request, show Cancel and Change buttons.
     */
    mySide = 0,
    /**
     * This is other side change request, show Reject and Accept buttons.
     */
    otherSide,
    /**
     * No buttons are shown
     */
    noButtons,
}

export enum EnumChangeRequestStatus {
    Uncnown = 0,
    Created = 1,
    Canceled = 2,
    Rejected = 3,
    Accepted = 4,
}

export interface IDealChangeRequest {
    id: number;
    requestType: EnumOrderSide;
    duration?: number;
    price?: string;
    status: EnumChangeRequestStatus;
    createdAt: Date;
}
