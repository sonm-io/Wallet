import { EnumProfileStatus } from 'app/api/types';

export enum EnumKycListItemState {
    Default = 0,
    PasswordRequest,
    ShowLink,
}

export interface IKycListItem {
    id: string;
    title: string;
    iconBase64: string;
    description: string;
    profileStatus: EnumProfileStatus;
    price: string;
    kycAddress: string;
}

export interface IKycListItemProps extends IKycListItem {
    className?: string;
    state: EnumKycListItemState;
    validationMessage?: string;
    kycLink?: string;

    onClickSelect: (id: string) => void;
    onSubmitPassword: (id: string, password: string) => void;
    onCancelPassword: (id: string) => void;
    onCloseLink: (id: string) => void;
}
