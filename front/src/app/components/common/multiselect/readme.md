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

        value: [{name: 'test3', value: 3}],

        toggle: action.bound(function (event, value) {
            this.isExpanded = value !== undefined
                ? value
                : !this.isExpanded;
        }),

        // Event Handlers:

        onButtonClick: action.bound(function (event, value) {
            this.eventCounter.onButtonClick++;
            this.toggle(event, value);
        }),

        onChange: action.bound(function (params) {
            this.eventCounter.onChange++;
            this.value = params.value;
        }),

        onRequireClose: action.bound(function () {
            this.eventCounter.onRequireClose++;
            this.toggle(null, false);
        }),
    });

    const list = Array.from(Array(50).keys()).map(i => ({ name: 'test' + (i+1), value: i+1 }));

    const Container = observer(() =>
        <MultiSelect
            name="test"
            label="Country"
            filterPlaceHolder='Type to search'
            isExpanded={state.isExpanded}
            clearBtn
            panelStyle={{ width: 150 }}
            // data
            nameIndex="name"
            valueIndex="value"
            list={list}
            value={toJS(state.value)}
            // events
            onChange={state.onChange}
            onButtonClick={state.onButtonClick}
            onRequireClose={state.onRequireClose.bind(state)}
            />
    );

    const StateInfo = observer(() =>
        <div>
            <div>value: {state.value.map(i => `${i.value}: ${i.name}`).join('; ')}</div>
            <div>isExpanded: {state.isExpanded.toString()}</div>
            <div>events: {Object.keys(state.eventCounter).map(name => `${name}: ${state.eventCounter[name]}`).join(', ')}</div>
        </div>
    );

    <div>
        <StateInfo />
        <Container />
    </div>
