import { EnumProfileStatus, IOrder } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl?: string;
    profileAddress: string;
    profileName?: string;
    profileStatus: EnumProfileStatus;
    usdPerHour: string;
    duration: number;
    className?: string;
    children?: React.ReactNode;
    orderId: string;

    shemeOfCustomField: Array<Array<string>>;
    order: IOrder;
}
