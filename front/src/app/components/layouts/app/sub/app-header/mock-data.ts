import { IAppHeaderProps } from './index';
import { marketAccountSelectProps } from '../account-select/mock-data';

export const props: IAppHeaderProps = {
    className: '',
    hasMarketAccountSelect: true,
    gethNodeUrl: 'lol',
    sonmNodeUrl: 'qwe',
    onNavigate: () => null,
    onExit: () => null,
    onChangeAccount: () => null,
    accountList: marketAccountSelectProps.accounts,
    account: marketAccountSelectProps.accounts[0],
    isTestNet: false,
    marketStats: { dealsCount: 0, dealsPrice: '0', daysLeft: 0 },
};
