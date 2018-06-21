## KycListItem

Do not look at the row gap, this is not list demo, but single item demo.

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const data = require('./mock-data.js');

const state = observable({
    eventCounter: {
        onClick: 0,
    },
});

const Container = observer(() => (
    <div>{data.map(i => <KycListItem {...i} />)}</div>
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
