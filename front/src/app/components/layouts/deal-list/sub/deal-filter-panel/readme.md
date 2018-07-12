DealFilterPanel:

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const state = observable({
    eventCounter: {
        onClick: 0,
    },
    query: '',
    dateRange: [new Date(0), new Date()],
    onlyActive: false,

    onUpdateFilter: action.bound(function(key, value) {
        this[key] = value;
    }),
});

const Container = observer(() => (
    <DealFilterPanel
        query={state.query}
        dateRange={state.dateRange}
        onlyActive={state.onlyActive}
        onUpdateFilter={state.onUpdateFilter}
    />
));

const StateInfo = observer(() => (
    <div>
        <div>
            events:{' '}
            {Object.keys(state.eventCounter)
                .map(name => `${name}: ${state.eventCounter[name]}`)
                .join(', ')}
        </div>
    </div>
));

<div>
    <StateInfo />
    <Container />
</div>;
```
