import { EProfileStatus } from 'app/api/types';

export interface IOrdersListItemProps {
    logoUrl: string;
    address: string;
    name: string;
    account: string;
    status: EProfileStatus;
    cpuCount: number;
    gpuCount: number;
    ramSize: number; // MB
    usdPerHour: number;
    duration: number;
    // optional
    className?: string;
}
