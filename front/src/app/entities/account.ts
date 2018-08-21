import { IAccountInfo } from 'common/types/account';

export interface IAccountItemView extends IAccountInfo {
    etherBalance: string;
    primaryTokenBalance: string;
}
