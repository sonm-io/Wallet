Orders:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;
    const { EnumProfileStatus } = require ('app/api/types');
    const { data } = require ('./mock-data')

    const state = observable({
      eventsCounter: {
        onChangeLimit: 0,
        onChangeOrder: 0,
        onRefresh: 0,
        onRequireQuickBuy: 0
      },
      orderBy: 'RAM size',
      orderDesc: false,
      pageLimit: 25,
      onChangeLimit: action.bound(function (pageLimit) {
        this.eventsCounter.onChangeLimit++;
        this.pageLimit = pageLimit;
      }),
      onChangeOrder: action.bound(function (orderKey, isDesc) {
        this.eventsCounter.onChangeOrder++;
        this.orderBy = orderKey;
        this.orderDesc = isDesc;
      }),
      onRefresh: action.bound(function () {
        this.eventsCounter.onRefresh++;
      }),
      onRequireQuickBuy: action.bound(function (orderId) {
        this.eventsCounter.onRequireQuickBuy++;
      })
    });

    const StateInfo = observer(() =>
      <div>
        <div>events: {Object.keys(state.eventsCounter).map(name => `${name}: ${state.eventsCounter[name]}`).join(', ')}</div>
        <div>orderBy: {state.orderBy}</div>
        <div>orderDesc: {state.orderDesc.toString()}</div>
        <div>pageLimit: {state.pageLimit}</div>
      </div>
    );

    const Container = observer(() =>
      <OrderListView
        orderBy={state.orderBy}
        orderDesc={state.orderDesc}
        pageLimit={state.pageLimit}
        dataSource={data}
        schemaOfOrderItem={[['Cpu Count','cpuCount'],['Gpu Count','gpuCount'],['Eth hashrate','hashrate']]}
        onChangeLimit={state.onChangeLimit}
        onChangeOrder={state.onChangeOrder}
        onRefresh={state.onRefresh}
        onRequireQuickBuy={state.onRequireQuickBuy}
        />
    );

    <div>
      <StateInfo/>
      <Container />
    </div>
