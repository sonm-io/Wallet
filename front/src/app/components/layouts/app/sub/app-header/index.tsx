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
    onExit: () => void;
    onChangeAccount: (account: IAccount) => void;
    hasMarketAccountSelect: boolean;
    account?: IAccount;
    accountList: Array<IAccount>;
    marketStats: IMarketStats;
    snmBalance: string;
    etherBalance: string;
    marketBalance: string;
    menu: Array<TMenuItem>;
    disableAccountSelect?: boolean;
    onClickMyProfile: () => void;
}

export class AppHeader extends React.Component<IAppHeaderProps, any> {
    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
    };

    protected handleClickMyProfile = (event: any) => {
        event.preventDefault();

        this.props.onClickMyProfile();
    };

    public render() {
        const p = this.props;

        return (
            <div
                {...{ 'data-display-id': `app-header` }}
                className={`sonm-app-header sonm-app-header--${
                    p.isTestNet ? 'rinkeby' : 'livenet'
                }`}
            >
                <div className="sonm-app-header__logo sonm-app-header__item" />
                <NavMenuDropdown
                    className="sonm-app-header__menu sonm-app-header__item"
                    topMenuActiveItem={p.hasMarketAccountSelect ? 1 : 0}
                    items={p.menu}
                />
                {p.hasMarketAccountSelect ? (
                    <a
                        className="sonm-app-header__profile"
                        onClick={this.handleClickMyProfile}
                    >
                        <Icon
                            className="sonm-app-header__profile-icon"
                            title="logout"
                            href="#exit"
                            i="Profile"
                        />
                    </a>
                ) : null}
                {p.account && p.hasMarketAccountSelect ? (
                    <MarketAccountSelect
                        disabled={p.disableAccountSelect}
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
                        className="sonm-app-header__icon"
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
