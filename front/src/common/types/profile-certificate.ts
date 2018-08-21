import { EnumProfileStatus } from './profile-status';

export interface ICertificate {
    status: EnumProfileStatus;
    address: string;
}
