import { EProfileStatus } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl: string;
    address: string;
    name?: string;
    account: string;
    status: EProfileStatus;
    customFields: Map<string, string>;
    usdPerHour: number;
    duration: number;
    // optional
    className?: string;
}
