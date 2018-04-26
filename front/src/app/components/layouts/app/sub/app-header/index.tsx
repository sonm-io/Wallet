import * as React from 'react';
import { Icon } from 'app/components/common/icon';
import { NavMenuDropdown, TMenuItem } from '../nav-menu-dropdown';
import { MarketAccountSelect } from '../account-select';
import { marketAccountSelectProps } from '../account-select/mock-data';
import { AppBalance } from '../balance';

export interface IAppHeaderProps {
    className?: string;
    path: string;
    isTestNet: boolean;
    gethNodeUrl: string;
    sonmNodeUrl: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
}

export class AppHeader extends React.Component<IAppHeaderProps, any> {
    protected static menuConfig: Array<TMenuItem> = [
        [
            'Wallet',
            '/send',
            [
                ['Accounts', '/accounts', undefined],
                ['History', '/history', undefined],
                ['Send', '/send', undefined],
            ],
        ],
        [
            'Market',
            '/market/deals',
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
                    className={'sonm-app-header__menu sonm-app-header__item'}
                    path={p.path}
                    items={AppHeader.menuConfig}
                    onChange={this.props.onNavigate}
                />
                <MarketAccountSelect
                    {...marketAccountSelectProps}
                    className={'sonm-app-header__account sonm-app-header__item'}
                />
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
