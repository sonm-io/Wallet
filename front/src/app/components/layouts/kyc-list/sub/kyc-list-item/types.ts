import { IKycValidator } from 'app/api/types';

export interface IKycListItemProps {
    className?: string;
    index: number;
    validator: IKycValidator;
    kycLink?: string;
    validationMessage?: string;
    isSelected: boolean;
    onClick: (index: number) => void;
    onSubmitPassword: (index: number, password: string) => void;
    onCancelPassword: (index: number) => void;
    onCloseLink: (index: number) => void;
}
