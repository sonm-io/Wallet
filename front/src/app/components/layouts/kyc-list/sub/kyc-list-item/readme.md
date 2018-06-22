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
                {...i}
                state={0}
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
const { EnumKycListItemState } = require('./types');
const data = require('./mock-data.js');
const emptyFn = () => {};

<div>
    <KycListItem
        {...data[0]}
        state={EnumKycListItemState.Default}
        onClickSelect={emptyFn}
        onSubmitPasword={emptyFn}
    />
    <KycListItem
        {...data[1]}
        state={EnumKycListItemState.PasswordRequest}
        onClickSelect={emptyFn}
        onSubmitPasword={emptyFn}
    />
    <KycListItem
        {...data[2]}
        state={EnumKycListItemState.ShowLink}
        kycLink="http://www.typescriptlang.org/docs/handbook/advanced-types.html"
        onClickSelect={emptyFn}
        onSubmitPasword={emptyFn}
    />
</div>;
```
