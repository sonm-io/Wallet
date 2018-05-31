Multiselect:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    useStrict()

    const state = observable({
        isExpanded: false,

        eventCounter: {
            onButtonClick: 0,
            onChange: 0,
            onRequireClose: 0
        },

        value: [],

        // Event Handlers:

        onButtonClick: action.bound(function (event, value) {
            this.eventCounter.onButtonClick++;
            this.toggle(event, value);
        }),

        onChange: action.bound(function (params) {
            this.eventCounter.onChange++;
            this.value = params.value;
        }),
    });

    const list = Array.from(Array(50).keys()).map(i => ({ name: 'test' + (i+1), value: i+1 }));

    const Container = observer(() =>
        <MultiSelect
            name="test"
            label="Country"
            filterPlaceHolder='Type to search'
            hasClearButton
            // data
            nameIndex="name"
            list={list}
            value={toJS(state.value)}
            // events
            onChange={state.onChange}
            disabled={false}
        />
    );

    const StateInfo = observer(() =>
        <div>
            <div>value: {JSON.stringify(state.value)}</div>
            <div>isExpanded: {state.isExpanded.toString()}</div>
            <div>events: {Object.keys(state.eventCounter).map(name => `${name}: ${state.eventCounter[name]}`).join(', ')}</div>
        </div>
    );

    <div>
        <StateInfo />
        <Container />
    </div>
