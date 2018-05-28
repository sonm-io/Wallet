import { INavMenuDropdownProps } from './index';

export const props: INavMenuDropdownProps = {
    onChange: (url: string) => alert(url),
    topMenuActiveItem: '/send',
    items: [
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
            'market',
            '/deals',
            [
                ['Search', '/search', undefined],
                ['Profiles', '/profile-list', undefined],
                ['Deals', '/deals', undefined],
                ['Send', '/send', undefined],
            ],
        ],
    ],
};
