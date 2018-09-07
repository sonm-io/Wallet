MarketAccountSelect:

    <MarketAccountSelect
        {...{
            value: (window.market_account_list_value = {
                address: '0x1234567890123456789012345678901234567890',
                name: 'name1',
                marketBalance: '123412412123123216',
                marketUsdBalance: '456723862937845182',
            }),
            accounts: [
                window.market_account_list_value ,
                {
                    address: '0x1234567890123456789012345678901234567866',
                    name: 'name2',
                    marketBalance: '947212412123123216',
                    marketUsdBalance: '984623862937845182',
                },
                {
                    address: '0x1234567890123456789012345678901234567877',
                    name: 'name2',
                    marketBalance: '378412412123123216',
                    marketUsdBalance: '983723862937845182',
                },
            ],
            url: '/url',
            onChange: (a,b,c) => { console.log(a,b,c) },
            hidden: false,
        }}
    />
