Password:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const state = observable({
        value: '',
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <Password
            value={state.value}
            onChange={state.onChange}
            placeholder="Enter password"
            readOnly={false}
        />
    );

    const StateInfo = observer(() =>
        <div>
            <div>value: {state.value}</div>
        </div>
    );

    <div>
        <StateInfo />
        <Container />
    </div>
