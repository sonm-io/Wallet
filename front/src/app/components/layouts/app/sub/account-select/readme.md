MarketAccountSelect:

    <MarketAccountSelect
        {...{
            value: (window.market_account_list_value = {
                address: '0x1234567890123456789012345678901234567890',
                name: 'name1',
                snmBalance: '1234124.12',
                usdBalance: '456723.12',
            }),
            accounts: [
                window.market_account_list_value ,
                {
                    address: '0x1234567890123456789012345678901234567866',
                    name: 'name2',
                    snmBalance: '1000000.12',
                    usdBalance: '56723.12',
                },
                {
                    address: '0x1234567890123456789012345678901234567877',
                    name: 'name2',
                    snmBalance: '11.12',
                    usdBalance: '22.12',
                },
            ],
            url: '/url',
            onChange: (a,b,c) => { console.log(a,b,c) },
            hidden: false,
        }}
    />
