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

const emptyFn = () => {};

const Container = observer(() => (
    <div>
        {data.map(i => (
            <KycListItem
                validator={i}
                isSelected={false}
                onClickSelect={emptyFn}
                onSubmitPasword={emptyFn}
            />
        ))}
    </div>
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

## KycListItem states demo

```js
const d = require('./mock-data.js');
const emptyFn = () => {};

<div>
    <KycListItem
        validator={d[0]}
        isSelected={false}
        onClickSelect={emptyFn}
        onSubmitPasword={emptyFn}
    />
    <KycListItem
        validator={d[1]}
        isSelected={true}
        onClickSelect={emptyFn}
        onSubmitPasword={emptyFn}
    />
    <KycListItem
        validator={d[2]}
        isSelected={true}
        kycLink="http://www.typescriptlang.org/docs/handbook/advanced-types.html"
        onClickSelect={emptyFn}
        onSubmitPasword={emptyFn}
    />
</div>;
```
