ident icon component:

    <AccountItem
        address="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28"
        className="AccountItem"
        name="Wallet 1"
        etherBalance="10000.823749827938479"
        sonmBalance="34456"
    />
    
edit name
            
    <AccountItem
        address="0x01602E49e4413Ce46Cd559E86d4c9939e2332B28"
        className="AccountItem"
        name="Wallet 1"
        etherBalance="10000.823749827938479"
        sonmBalance="34456"
        onRename={newName => alert(newName)}
    />