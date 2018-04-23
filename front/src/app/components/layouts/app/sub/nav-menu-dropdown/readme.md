nav menu:

    <NavMenuDropdown
        disabled='/accounts'
        onChange={url => alert(url)} url="/send"
        items={[
            [
                'Wallet', '/send',
                [
                    ['Accounts', '/accounts'],
                    ['History', '/history'],
                    ['Send', '/send'],
                ],
            ],
            [
                'Market','/deals',
                [
                    ['Search', '/search'],
                    ['Profiles', '/profile-list'],
                    ['Deals', '/deals'],
                    ['Send', '/send'],
                ],
            ],
        ]}
    />
