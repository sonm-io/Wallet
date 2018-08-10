import { TPrice, TEthereumAddress } from './types';
import { EnumProfileStatus } from 'app/entities/account';

export interface IProfileBrief {
    logoUrl?: string;
    address: TEthereumAddress;
    name?: string;
    etherBalance?: TPrice;
    usdBalance?: TPrice;
    snmBalance?: TPrice;
    marketBalance?: TPrice;
    status: EnumProfileStatus;
}

export interface IProfile extends IProfileBrief {
    // TODO
}
