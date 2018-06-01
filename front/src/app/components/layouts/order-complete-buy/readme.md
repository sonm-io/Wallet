OrderBuySuccess:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const state = observable({
        eventCounter: {
            onClickDeals: 0,
            onClickMarket: 0,
            onClickOrders: 0,
        },
        onClickDeals: action.bound(function () {
            this.eventCounter.onClickDeals++;
        }),
        onClickMarket: action.bound(function () {
            this.eventCounter.onClickMarket++;
        }),
        onClickOrders: action.bound(function () {
            this.eventCounter.onClickOrders++;
        }),
    })

    const Container = observer(() =>
        <OrderCompleteBuy
            onClickDeals={state.onClickDeals}
            onClickMarket={state.onClickMarket}
            onClickOrders={state.onClickOrders}
        />
    );

    const StateInfo = observer(() =>
        <div>
            <div>events: {Object.keys(state.eventCounter).map(name => `${name}: ${state.eventCounter[name]}`).join(', ')}</div>
        </div>
    );

    <div style={{height: '500px'}}>
        <StateInfo />
        <Container />
    </div>
