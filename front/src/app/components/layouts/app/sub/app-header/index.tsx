import * as React from 'react';
import { Icon } from 'app/components/common/icon';
import { NavMenuDropdown, TMenuItem } from '../nav-menu-dropdown';
import { MarketAccountSelect, IAccount } from '../account-select';
import { AppBalance } from '../balance';
export { IAccount } from '../account-select';
import { IMarketStats } from 'app/api/types';

export interface IAppHeaderProps {
    className?: string;
    isTestNet: boolean;
    gethNodeUrl: string;
    sonmNodeUrl: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
    onChangeAccount: (account: IAccount) => void;
    hasMarketAccountSelect: boolean;
    account?: IAccount;
    accountList: Array<IAccount>;
    marketStats: IMarketStats;
    snmBalance: string;
    etherBalance: string;
    marketBalance: string;
}

let sendPath = '';
let marketPath = '';

export class AppHeader extends React.Component<IAppHeaderProps, any> {
    protected static menuConfig: Array<TMenuItem> = [
        [
            'Wallet',
            (sendPath = '/wallet/send'),
            [
                ['Accounts', '/wallet/accounts', undefined],
                ['History', '/wallet/history', undefined],
                ['Send', '/wallet/send', undefined],
            ],
        ],
        [
            'market',
            (marketPath = '/market/deals'),
            [
                ['Profiles', '/market/profiles', undefined],
                ['Orders', '/market/orders/all', undefined],
                ['Deals', '/market/deals', undefined],
                ['Deposit', '/market/dw/deposit', undefined],
                ['Withdraw', '/market/dw/withdraw', undefined],
                ['History', '/market/dw/history', undefined],
            ],
        ],
    ];

    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    protected handleChangePath = (path: string) => {
        this.props.onNavigate(path);
    };

    public render() {
        const p = this.props;

        return (
            <div
                className={`sonm-app-header sonm-app-header--${
                    p.isTestNet ? 'rinkeby' : 'livenet'
                }`}
            >
                <div className="sonm-app-header__logo sonm-app-header__item" />
                <NavMenuDropdown
                    className="sonm-app-header__menu sonm-app-header__item"
                    topMenuActiveItem={
                        p.hasMarketAccountSelect ? marketPath : sendPath
                    }
                    items={AppHeader.menuConfig}
                    onChange={this.handleChangePath}
                />
                {p.account && p.hasMarketAccountSelect ? (
                    <MarketAccountSelect
                        value={p.account}
                        accounts={p.accountList}
                        onChange={p.onChangeAccount}
                        className="sonm-app-header__account sonm-app-header__item"
                    />
                ) : null}
                <div className="sonm-app-header-block__wrapper sonm-app-header__item">
                    <AppBalance
                        className="sonm-app-header-block__balance"
                        marketMode={p.hasMarketAccountSelect}
                        etherBalance={p.etherBalance}
                        snmBalance={p.snmBalance}
                        usdBalance="1234567890-0987654321879"
                        marketBalance={p.marketBalance}
                        marketDealsCount={p.marketStats.dealsCount}
                        marketDealsPrice={p.marketStats.dealsPrice}
                        marketDaysLeft={p.marketStats.daysLeft}
                    />
                    <Icon
                        className={
                            'sonm-app-header__icon sonm-app-header-block__icon'
                        }
                        title="logout"
                        href="#exit"
                        tag="a"
                        i="Exit"
                        onClick={this.handleExit}
                    />
                    <div className="sonm-app-header-block__market sonm-network">
                        <span className="sonm-network__name">
                            {p.isTestNet ? 'TESTNET' : 'LIVENET'}
                        </span>
                        <span className="sonm-network__urls">
                            {p.sonmNodeUrl} | {p.gethNodeUrl}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
