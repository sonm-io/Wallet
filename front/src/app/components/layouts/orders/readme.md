Orders:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;
    const { EnumProfileStatus } = require ('app/api/types');
    const { data, getSorted } = require ('./mock-data')

    const state = observable({
      eventsCounter: {
        onChangeLimit: 0,
        onChangeOrder: 0,
        onRefresh: 0
      },
      orderBy: 'RAM size',
      desc: false,
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
          orderKeys: ['CPU Count', 'GPU ETH hashrate', 'RAM size'],
          desc: state.desc,
          limit: state.limit,
          limits: [10, 25, 50, 100],
          onChangeLimit: state.onChangeLimit,
          onChangeOrder: state.onChangeOrder,
          onRefresh: state.onRefresh
        }}
        list={getSorted(data, state.orderBy, state.desc)}
        />
    );

    <div>
      <StateInfo/>
      <Container />
    </div>
