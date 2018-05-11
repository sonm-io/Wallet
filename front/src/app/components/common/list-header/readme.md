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
      orderDesc: true,
      pageLimit: 25,
      onChangeLimit: action.bound(function (limit) {
        this.eventsCounter.onChangeLimit++;
        this.pageLimit = limit;
      }),
      onChangeOrder: action.bound(function (orderKey, isDesc) {
        this.eventsCounter.onChangeOrder++;
        this.orderBy = orderKey;
        this.orderDesc = isDesc;
      }),
      onRefresh: action.bound(function () {
        this.eventsCounter.onRefresh++;
      })
    });

    const Container = observer(() =>
      <ListHeader
        orderBy={state.orderBy}
        orderKeys={['lol', 'foo', 'bar']}
        orderDesc={state.orderDesc}
        pageLimit={state.pageLimit}
        pageLimits={[10, 25, 50, 100]}
        onChangeLimit={state.onChangeLimit}
        onChangeOrder={state.onChangeOrder}
        onRefresh={state.onRefresh}
        />
    );

    const StateInfo = observer(() =>
      <div>
        <div>events: {Object.keys(state.eventsCounter).map(name => `${name}: ${state.eventsCounter[name]}`).join(', ')}</div>
        <div>orderBy: {state.orderBy}</div>
        <div>orderDesc: {state.orderDesc.toString()}</div>
        <div>pageLimit: {state.pageLimit}</div>
      </div>
    );

    <div>
      <StateInfo/>
      <Container />
    </div>
