import { EnumProfileStatus } from './profile-status';
import { IProfileAttribute } from './profile-attribute';
import { IProfileCertificate } from './profile-certificate';

export interface IProfileBrief {
    name?: string;
    address: string;
    status: EnumProfileStatus;
}

export interface IProfile extends IProfileBrief {
    sellOrders: number;
    buyOrders: number;
    deals: number;
    country: string;
    logoUrl: string;
}

export interface IProfileInfo extends IProfile {
    attributes: Array<IProfileAttribute>;
    description: string;
    certificates: Array<IProfileCertificate>;
}

export const emptyProfile: IProfileInfo = Object.freeze({
    attributes: [],
    description: '',
    certificates: [],
    sellOrders: 0,
    buyOrders: 0,
    deals: 0,
    country: 'uk',
    logoUrl: '',
    name: '',
    address: '',
    status: EnumProfileStatus.anon,
});
