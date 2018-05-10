Order list item:

    const { EnumProfileStatus } = require ('app/api/types');

    <OrdersListItem
      address="0x0"
      name="Vasian Home Mining Inc"
      account="0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52"
      status={EnumProfileStatus.ident}
      customFields={new Map([['CPU Count','3'],['GPU ETH hashrate','80.1 Mh/s',],['RAM size','1024 Mb']])}
      usdPerHour={120}
      duration={500}
    />
