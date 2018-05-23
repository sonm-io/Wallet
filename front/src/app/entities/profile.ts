import { EnumProfileStatus } from '../api/types';
import { TPrice, TEthereumAddress } from './types';

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
