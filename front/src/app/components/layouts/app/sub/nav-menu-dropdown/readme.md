nav menu:

```js
const alertFactory = name => {
    return () => {
        alert(name);
    };
};

<NavMenuDropdown
    {...{
        disabled: '/accounts',
        url: '/send',
        items: [
            [
                'Wallet',
                undefined,
                [
                    ['Accounts', alertFactory('Accounts'), undefined],
                    ['History', alertFactory('History'), undefined],
                    ['Send', alertFactory('Send'), undefined],
                ],
            ],
            [
                'Market',
                undefined,
                [
                    ['Search', alertFactory('Search'), undefined],
                    ['Profiles', alertFactory('Profiles'), undefined],
                    ['Deals', alertFactory('Deals'), undefined],
                    ['Send', alertFactory('Send'), undefined],
                ],
            ],
        ],
    }}
/>;
```
