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
        onShowConfirmation: 0,
        onCancelConfirmation: 0,
        onSubmitPassword: 0,
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
    onShowConfirmation: action.bound(function() {
        this.eventsCounter.onShowConfirmation++;
        this.showConfirmation = true;
    }),
    onCancelConfirmation: action.bound(function() {
        this.eventsCounter.onCancelConfirmation++;
        this.showConfirmation = false;
        this.validationMessage = undefined;
    }),
    onSubmitPassword: action.bound(function(p) {
        this.eventsCounter.onSubmitPassword++;
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

const Container = observer(() => (
    <OrderCreateView
        profile={profile}
        validation={{}}
        deposit="123456789012345678"
        showConfirmation={state.showConfirmation}
        validationMessage={state.validationMessage}
        onUpdateField={state.onUpdateField}
        onCancel={state.onCancel}
        onShowConfirmation={state.onShowConfirmation}
        onCancelConfirmation={state.onCancelConfirmation}
        onSubmitPassword={state.onSubmitPassword}
        price={state.price}
        duration={state.duration}
        counterparty={state.counterparty}
        professional={state.professional}
        registered={state.registered}
        identified={state.identified}
        anonymous={state.anonymous}
        useBlacklist={state.useBlacklist}
        cpuCount={state.cpuCount}
        gpuCount={state.gpuCount}
        ramSize={state.ramSize}
        storageSize={state.storageSize}
        overlayAllowed={state.overlayAllowed}
        outboundAllowed={state.outboundAllowed}
        incomingAllowed={state.incomingAllowed}
        downloadSpeed={state.downloadSpeed}
        uploadSpeed={state.uploadSpeed}
        ethereumHashrate={state.ethereumHashrate}
        zcashHashrate={state.zcashHashrate}
        redshiftBenchmark={state.redshiftBenchmark}
    />
));

<div>
    <StateInfo />
    <Container />
</div>;
```
