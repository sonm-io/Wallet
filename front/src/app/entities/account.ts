import { IAccountInfo } from 'common/types/account';
import { ICurrencyInfo } from 'common/types/currency';

export interface IAccountItemView extends IAccountInfo {
    etherBalance: string;
    primaryTokenBalance: string;
    primaryTokenInfo: ICurrencyInfo;
}
