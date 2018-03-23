ident icon component:

    <AccountItem
        address="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28"
        className="AccountItem"
        name="Wallet 1"
        etherBalance="10000823749827938479"
        primaryTokenBalance="3445682394872937"
        primaryTokenInfo={{
            symbol: 'LOL',
            decimalPointOffset: 5,
            name: 'LOLOCOIN',
            address: '0x726348628763',
        }}
    />

edit name

 <AccountItem
address="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28"
className="AccountItem"
name="Wallet 1"
etherBalance="10000.823749827938479"
primaryTokenBalance="34456"
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
          address="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28"
          className="AccountItem"
          name="Wallet 1"
          etherBalance="10000.823749827938479"
          primaryTokenBalance="34456"
          onRename={newName => alert(newName)}
          onClickIcon={addr => alert(addr)}
          primaryTokenInfo={{
            symbol: 'LOL',
            decimalPointOffset: 5,
            name: 'LOLOCOIN',
            address: '0x726348628763',
         }}
      />  
