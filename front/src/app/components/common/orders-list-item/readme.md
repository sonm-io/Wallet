Order list item:

    const { EnumProfileStatus } = require ('app/api/types');

    <OrdersListItem
      schemaOfCustomField={[ ['Cpu Count', 'cpuCount'],['Gpu Count', 'gpuCount'],['GPU Eth hashrate', 'hashrate'],['Ram Size', 'ramSize'] ]}
      order={{
        id: '9',
        orderType: 1,
        creatorStatus: 0,
        creatorName: '',
        price: '2499999999999998400',
        duration: 8,
        orderStatus: 2,
        authorID: '0x8125721C2413d99a33E351e1F6Bb4e56b6b633FD',
        cpuCount: 1,
        gpuCount: 0,
        hashrate: 0,
        ramSize: 1,
      }}
    />
