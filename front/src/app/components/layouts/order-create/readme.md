### OrderCreate interactive sample

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;
const { EnumProfileStatus } = require('app/api/types');
const { profile, dealDetails, resourceParams } = require('./mock-data.js');

const getParamsWatch = (paramNames, obj) =>
    paramNames.map(name => (
        <div key={name}>
            {name}: {String(obj[name])}
        </div>
    ));

const emptyFn = () => {};
const password = 'password';

const state = observable({
    // Properties
    eventsCounter: {
        onUpdateField: 0,
        onCancel: 0,
        onNext: 0,
        onConfirmationCancel: 0,
        onSubmit: 0,
    },
    ...dealDetails,
    ...resourceParams,
    showConfirmation: false,
    validationMessage: undefined,

    // Actions
    onUpdateField: action.bound(function(key, value) {
        this.eventsCounter.onUpdateField++;
        this[key] = value;
        console.log(`onUpdateField: key=${key}, value=${value}`);
    }),
    onCancel: action.bound(function() {
        this.eventsCounter.onCancel++;
    }),
    onNext: action.bound(function() {
        this.eventsCounter.onNext++;
        this.showConfirmation = true;
    }),
    onConfirmationCancel: action.bound(function() {
        this.eventsCounter.onConfirmationCancel++;
        this.showConfirmation = false;
        this.validationMessage = undefined;
    }),
    onSubmit: action.bound(function(p) {
        this.eventsCounter.onSubmit++;
        if (p === password) {
            console.log('onSubmit:  success');
            this.showConfirmation = false;
            this.validationMessage = undefined;
        } else {
            this.validationMessage = 'Incorrect password';
            console.log(`onSubmit: ${this.validationMessage}`);
        }
    }),
});

const paramsToWatch = getParamsWatch(
    ['showConfirmation', 'validationMessage'],
    state,
);

const StateInfo = observer(() => (
    <div>
        <div>password: {password}</div>
        {paramsToWatch}
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
}).reduce((acc, key) => {
    acc[key] = state[key];
    return acc;
}, {});

const Container = observer(() => (
    <OrderCreate
        profile={profile}
        validation={{}}
        deposit="123456789012345678"
        {...params}
        showConfirmation={state.showConfirmation}
        validationMessage={state.validationMessage}
        onUpdateField={state.onUpdateField}
        onCancel={state.onCancel}
        onNext={state.onNext}
        onConfirmationCancel={state.onConfirmationCancel}
        onSubmit={state.onSubmit}
    />
));

<div>
    <StateInfo />
    <Container />
</div>;
```
