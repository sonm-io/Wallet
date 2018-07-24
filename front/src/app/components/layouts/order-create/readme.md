### OrderCreate interactive sample

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;
const { EnumProfileStatus } = require('app/api/types');
const { profile, dealDetails, resourceParams } = require('./mock-data.js');

const emptyFn = () => {};
const password = 'password';

const state = observable({
    eventsCounter: {},
    ...dealDetails,
    ...resourceParams,
    onUpdateField: action.bound(function(key, value) {
        this[key] = value;
    }),
});

const StateInfo = observer(() => (
    <div>
        <div>password: {password}</div>
        <div>
            events:{' '}
            {Object.keys(state.eventsCounter)
                .map(name => `${name}: ${state.eventsCounter[name]}`)
                .join(', ')}
        </div>
    </div>
));

const params = Object.keys({
    ...dealDetails,
    ...resourceParams,
}).reduce((key, acc) => {
    acc[key] = state[key];
    return acc;
}, {});

const Container = observer(() => (
    <OrderCreate
        profile={profile}
        validation={{}}
        onUpdateField={emptyFn}
        deposit="123456789012345678"
        {...params}
    />
));

<div>
    <StateInfo />
    <Container />
</div>;
```
