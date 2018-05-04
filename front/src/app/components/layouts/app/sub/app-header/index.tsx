import * as React from 'react';
import { Icon } from 'app/components/common/icon';
import { NavMenuDropdown, TMenuItem } from '../nav-menu-dropdown';
import { MarketAccountSelect, IAccount } from '../account-select';
import { AppBalance } from '../balance';

export { IAccount } from '../account-select';

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
    decimalPointOffset: number;
}

let sendPath = '';
let marketPath = '';

export class AppHeader extends React.Component<IAppHeaderProps, any> {
    protected static menuConfig: Array<TMenuItem> = [
        [
            'Wallet',
            (sendPath = '/send'),
            [
                ['Accounts', '/accounts', undefined],
                ['History', '/history', undefined],
                ['Send', '/send', undefined],
            ],
        ],
        [
            'Market',
            (marketPath = '/market/deals'),
            [
                ['Search', '/market/search', undefined],
                ['Profiles', '/market/profile-list', undefined],
                ['Deals', '/market/deals', undefined],
                ['Send', '/market/send', undefined],
            ],
        ],
    ];

    protected handleExit = (event: any) => {
        event.preventDefault();

        this.props.onExit();
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
                    onChange={this.props.onNavigate}
                />
                {p.account && p.hasMarketAccountSelect ? (
                    <MarketAccountSelect
                        value={p.account}
                        accounts={p.accountList}
                        decimalPointOffset={p.decimalPointOffset}
                        onChange={p.onChangeAccount}
                        className="sonm-app-header__account sonm-app-header__item"
                    />
                ) : null}
                <div className="sonm-app-header-block__wrapper sonm-app-header__item">
                    <AppBalance
                        className="sonm-app-header-block__balance"
                        marketMode={false}
                        etherBalance="1234567890123456789000"
                        snmBalance="12345678901234567890867876"
                        usdBalance="1234567890-0987654321879"
                        ratePerDay="123"
                        daysLeft="123"
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
