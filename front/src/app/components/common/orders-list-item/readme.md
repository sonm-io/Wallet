Order list item:

    const { EProfileStatus } = require ('app/api/types');

    <OrdersListItem
      address="0x0"
      name="Vasian Home Mining Inc"
      account="0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52"
      status={EProfileStatus.ident}
      cpuCount={3}
      gpuCount={1}
      ramSize={1024}
      usdPerHour={120}
      duration={500}
    />