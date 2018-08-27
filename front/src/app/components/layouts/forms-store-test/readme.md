FormsStoreTest:

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const state = observable({
    eventCounter: {
        onClick: 0,
    },
});

const Container = observer(() => <FormsStoreTest />);

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
