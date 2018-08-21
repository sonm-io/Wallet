import { EnumProfileStatus } from './profile-status';
import { IAttribute } from './profile-attribute';
import { ICertificate } from './profile-certificate';

export interface IAccountBrief {
    name?: string;
    address: string;
    status: EnumProfileStatus;
}

export interface IProfileBrief extends IAccountBrief {
    sellOrders: number;
    buyOrders: number;
    deals: number;
    country: string;
    logoUrl: string;
}

export interface IProfileFull extends IProfileBrief {
    attributes: Array<IAttribute>;
    description: string;
    certificates: Array<ICertificate>;
}

export const emptyProfile: IProfileFull = Object.freeze({
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
