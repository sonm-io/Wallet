Order list item:

    const { EnumProfileStatus } = require ('app/api/types');

    <OrdersListItem
      profileAddress="0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52"
      profileName="Vasian Home Mining Inc"
      profileStatus={EnumProfileStatus.ident}
      usdPerHour="120"
      duration={500}
      orderId="123"
      schemaOfCustomField={[ ['Cpu Count', 'cpuCount'],['Gpu Count', 'gpuCount'],['GPU Eth hashrate', 'hashrate'],['Ram Size', 'ramSize'] ]}
      order={{
        cpuCount: 4,
        gpuCount: 5,
        hashrate: 12,
        ramSize: 1024,
      }}
    />
