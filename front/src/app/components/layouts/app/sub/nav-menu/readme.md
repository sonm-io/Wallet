nav menu:

    <NavMenu disabled='/accounts' onChange={url => alert(url)} url="/send" items={[{ url: '/accounts', title: 'Accounts' }, { url: '/send', title: 'Send' }, { url: '/history', title: 'History' }]} />