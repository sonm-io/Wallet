nav menu:

    const alertFac = (name) => { return () => { alert(name) } };

    <NavMenuDropdown
        {...{
            disabled: '/accounts',
            url: '/send',
            items: [
                [
                    'Wallet', undefined,
                    [
                        ['Accounts', alertFac('Accounts'), undefined],
                        ['History', alertFac('History'), undefined],
                        ['Send', alertFac('Send'), undefined],
                    ],
                ],
                [
                    'Market', undefined,
                    [
                        ['Search', alertFac('Search'), undefined],
                        ['Profiles', alertFac('Profiles'), undefined],
                        ['Deals', alertFac('Deals'), undefined],
                        ['Send', alertFac('Send'), undefined],
                    ],
                ],
            ],
        }}
    />
