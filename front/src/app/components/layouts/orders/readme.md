Orders:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;
    const { EnumProfileStatus } = require ('app/api/types');

    const list = [
      {
        address:'0x0',
        name: 'Vasian Home Mining Inc',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EnumProfileStatus.ident,
        customFields: new Map([['CPU Count','3'],['GPU ETH hashrate','80.1 Mh/s',],['RAM size','1024 Mb']]),
        usdPerHour: 9,
        duration: 1000
      },
      {
        address:'0x0',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EnumProfileStatus.pro,
        customFields: new Map([['CPU Count','2'],['GPU ETH hashrate','180.1 Mh/s',],['RAM size','1024 Mb']]),
        usdPerHour: 120,
        duration: 50
      },
      {
        address:'0x0',
        account: '0x06bda3cf79946e8b32a0bb6a3daa174b577c55b52',
        status: EnumProfileStatus.pro,
        customFields: new Map([['CPU Count','6'],['GPU ETH hashrate','211.22 Mh/s',],['RAM size','4 Gb']]),
        usdPerHour: 9,
        duration: 5
      }
    ];

    const state = observable({
      eventsCounter: {
        onChangeLimit: 0,
        onChangeOrder: 0,
        onRefresh: 0
      },
      orderBy: 'foo',
      desc: true,
      limit: 25,
      onChangeLimit: action.bound(function (limit) {
        this.eventsCounter.onChangeLimit++;
        this.limit = limit;
      }),
      onChangeOrder: action.bound(function (orderKey, isDesc) {
        this.eventsCounter.onChangeOrder++;
        this.orderBy = orderKey;
        this.desc = isDesc;
      }),
      onRefresh: action.bound(function () {
        this.eventsCounter.onRefresh++;
      })
    });

    const StateInfo = observer(() =>
      <div>
        <div>events: {Object.keys(state.eventsCounter).map(name => `${name}: ${state.eventsCounter[name]}`).join(', ')}</div>
        <div>orderBy: {state.orderBy}</div>
        <div>desc: {state.desc.toString()}</div>
        <div>limit: {state.limit}</div>
      </div>
    );

    const Container = observer(() =>
      <OrdersView
        header={{
          orderBy: state.orderBy,
          orderKeys: ['lol', 'foo', 'bar'],
          desc: state.desc,
          limit: state.limit,
          limits: [10, 25, 50, 100],
          onChangeLimit: state.onChangeLimit,
          onChangeOrder: state.onChangeOrder,
          onRefresh: state.onRefresh
        }}
        list={list}
        />
    );

    <div>
      <StateInfo/>
      <Container />
    </div>
