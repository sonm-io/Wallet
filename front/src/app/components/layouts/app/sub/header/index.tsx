import * as React from 'react';
import { Icon } from 'app/components/common/icon';
import { NavMenuDropdown, TMenuItem } from '../nav-menu-dropdown';
import { MarketAccountSelect } from '../account-select';
import { marketAccountSelectProps } from '../account-select/mock-data';

interface IProps {
    className?: string;
    path: string;
    isTestNet: boolean;
    nodeUrl: string;
    onNavigate: (url: string) => void;
    onExit: () => void;
}

export class AppHeader extends React.Component<IProps, any> {
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
            '/deals',
            [
                ['Search', '/search', undefined],
                ['Profiles', '/profile-list', undefined],
                ['Deals', '/deals', undefined],
                ['Send', '/send', undefined],
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
                className={`sonm-header sonm-header--${
                    p.isTestNet ? 'rinkeby' : 'livenet'
                }`}
            >
                <div className="sonm-header__logo" />
                <NavMenuDropdown
                    className={'sonm-header__menu'}
                    path={p.path}
                    items={AppHeader.menuConfig}
                    onChange={this.props.onNavigate}
                />
                <MarketAccountSelect
                    {...marketAccountSelectProps}
                    className={'sonm-header__account'}
                />
                <Icon
                    className={'sonm-header__icon'}
                    title="logout"
                    href="#exit"
                    tag="a"
                    i="Exit"
                    onClick={this.handleExit}
                />
            </div>
        );
    }
}
