ident icon component:

    <AccountItem
        account={{
            address: "0x01602E49e4413Ce46Cd559E86d4c9939e2332B28",
            name: "Wallet 1",
            etherBalance: "10000823749827938479",
            primaryTokenBalance: "3445682394872937"
        }}
        className="AccountItem"
        primaryTokenInfo={{
            symbol: 'LOL',
            decimalPointOffset: 5,
            name: 'LOLOCOIN',
            address: '0x726348628763',
        }}
    />

edit name

    <AccountItem
        account={{
            address: "0x01602E49e4413Ce46Cd559E86d4c9939e2332B28",
            name: "Wallet 1",
            etherBalance: "10000.823749827938479",
            primaryTokenBalance: "34456",
        }}
        className="AccountItem"
        onRename={newName => alert(newName)}
        primaryTokenInfo={{
            symbol: 'LOL',
            decimalPointOffset: 5,
            name: 'LOLOCOIN',
            address: '0x726348628763',
        }}
    />

whith link:

      <AccountItem
          account={{
            address: "0x01602E49e4413Ce46Cd559E86d4c9939e2332B28",
            name: "Wallet 1",
            etherBalance: "10000.823749827938479",
            primaryTokenBalance: "34456",
          }}
          className="AccountItem"
          onRename={newName => alert(newName)}
          onClickIcon={addr => alert(addr)}
          primaryTokenInfo={{
            symbol: 'LOL',
            decimalPointOffset: 5,
            name: 'LOLOCOIN',
            address: '0x726348628763',
         }}
      />

hasButtons:

```js
const json = {
    version: 3,
    id: '8b951a0803cb236542c1d7125211b2bb',
    address: '09e5f58636f0ba428e7db7823a6e1f43199eaf4f',
    crypto: {
        ciphertext:
            '4ebe341acfd56385cdb505f24a1bb7ed5040c87a085e2d661977774def5910c1',
        cipherparams: { iv: '6d2c3f3c1c728341b600487f72a1700e' },
        cipher: 'aes-128-ctr',
        kdf: 'scrypt',
        kdfparams: {
            dklen: 32,
            salt:
                '529d0e83625969df562a84c3c311e35b546382f191ff5fdb5eaac5400ba452c6',
            n: 262144,
            r: 8,
            p: 1,
        },
        mac: 'f8bb3a8a30bc3d38d98d5d5f499f398dc703a67eb83235b90d232eeae21ee9ab',
    },
};

<AccountItem
    account={{
        address: '09e5f58636f0ba428e7db7823a6e1f43199eaf4f',
        name: 'Wallet 1',
        json: JSON.stringify(json),
        etherBalance: '10000.823749827938479',
        primaryTokenBalance: '34456',
    }}
    className="AccountItem"
    onRename={newName => alert(newName)}
    onClickIcon={addr => alert(addr)}
    primaryTokenInfo={{
        symbol: 'LOL',
        decimalPointOffset: 5,
        name: 'LOLOCOIN',
        address: '0x726348628763',
    }}
    hasButtons
/>;
```
