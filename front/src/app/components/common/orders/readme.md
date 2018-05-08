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
        customFields: new Map([['CPU Count','3'],['GPU ETH hashrate','80.1 Mh/s',],['RAM size','1024 Mb']]),
        usdPerHour: 120,
        duration: 500
      },
      {
        address:'0x0',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EProfileStatus.full,
        customFields: new Map([['CPU Count','2'],['GPU ETH hashrate','180.1 Mh/s',],['RAM size','1024 Mb']]),
        usdPerHour: 120,
        duration: 500
      },
      {
        address:'0x0',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EProfileStatus.pro,
        customFields: new Map([['CPU Count','6'],['GPU ETH hashrate','211.22 Mh/s',],['RAM size','4 Gb']]),
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
