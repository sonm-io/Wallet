import { EnumProfileStatus } from 'app/api/types';

export interface IKycListItemProps {
    className?: string;
    iconBase64: string;
    title: string;
    description: string;
    profileStatus: EnumProfileStatus;
    price: string;
    kycAddress: string;
}
