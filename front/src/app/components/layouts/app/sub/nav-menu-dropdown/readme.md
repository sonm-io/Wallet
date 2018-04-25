nav menu:

    <NavMenuDropdown
        {...{
            disabled: '/accounts',
            onChange: url => alert(url),
            url: '/send',
            items: [
                [
                    'Wallet', '/send',
                    [
                        ['Accounts', '/accounts', undefined],
                        ['History', '/history', undefined],
                        ['Send', '/send', undefined],
                    ],
                ],
                [
                    'Market', '/deals',
                    [
                        ['Search', '/search', undefined],
                        ['Profiles', '/profile-list', undefined],
                        ['Deals', '/deals', undefined],
                        ['Send', '/send', undefined],
                    ],
                ],
            ],
        }}
    />
