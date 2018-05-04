List header:

 const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

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

    const Container = observer(() =>
      <ListHeader
        orderBy={state.orderBy}
        orderKeys={['lol', 'foo', 'bar']}
        desc={state.desc}
        limit={state.limit}
        limits={[10, 25, 50, 100]}
        onChangeLimit={state.onChangeLimit}
        onChangeOrder={state.onChangeOrder}
        onRefresh={state.onRefresh}
        />
    );

    const StateInfo = observer(() =>
      <div>
        <div>events: {Object.keys(state.eventsCounter).map(name => `${name}: ${state.eventsCounter[name]}`).join(', ')}</div>
        <div>orderBy: {state.orderBy}</div>
        <div>desc: {state.desc.toString()}</div>
        <div>limit: {state.limit}</div>
      </div>
    );

    <div>
      <StateInfo/>
      <Container />
    </div>
