Orders:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;
    const { EProfileStatus } = require ('app/api/types');

    const list = [
      {
        address:'0x0',
        name: 'Vasian Home Mining Inc',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EProfileStatus.ident,
        cpuCount: 3,
        gpuCount: 1,
        ramSize: 1024,
        usdPerHour: 120,
        duration: 500
      },
      {
        address:'0x0',
        name: 'Vasian Home Mining Inc',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EProfileStatus.ident,
        cpuCount: 3,
        gpuCount: 1,
        ramSize: 1024,
        usdPerHour: 120,
        duration: 500
      },
      {
        address:'0x0',
        name: 'Vasian Home Mining Inc',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EProfileStatus.ident,
        cpuCount: 3,
        gpuCount: 1,
        ramSize: 1024,
        usdPerHour: 120,
        duration: 500
      }
    ];


    const header = {
      orderBy: state.orderBy,
      orderKeys: ['lol', 'foo', 'bar'],
      desc: state.desc,
      limit: state.limit,
      limits: [10, 25, 50, 100],
      onChangeLimit: () => {},
      onChangeOrder: () => {},
      onRefresh: () => {}
    };

    <Orders header={header} list={list} />
