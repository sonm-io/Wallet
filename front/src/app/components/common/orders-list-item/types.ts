import { EnumProfileStatus } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl?: string;
    address: string;
    name?: string;
    account: string;
    status: EnumProfileStatus;
    customFields: Map<string, string>;
    usdPerHour: string;
    duration: number;
    // optional
    className?: string;
}
