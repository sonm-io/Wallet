import { EnumProfileStatus } from './profile-status';

export interface IProfileCertificate {
    status: EnumProfileStatus;
    address: string;
}
