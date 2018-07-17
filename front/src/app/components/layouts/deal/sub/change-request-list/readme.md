### Different items

```js
const { requests } = require('./mock-data.js');
<ChangeRequestList
    requests={requests}
    mySide={1}
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
/>;
```

### Confirmation panel opened

```js
const emptyFn = () => {};
const { requests } = require('./mock-data.js');
<ChangeRequestList
    requests={requests.slice(0, 2)}
    mySide={1}
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    showConfirmation={true}
    onSubmit={emptyFn}
    onConfirmationCancel={emptyFn}
/>;
```

### Interactive sample

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const { requests } = require('./mock-data.js');

const password = 'password';

const state = observable({
    eventCounter: {
        onCreateRequest: 0,
        onCancelRequest: 0,
        onChangeRequest: 0,
        onSubmitReject: 0,
        onSubmitAccept: 0,
    },
    requests: [],

    // Data presets:
    makeEmpty: action.bound(function() {
        this.requests = [];
    }),
    makeCustomer: action.bound(function() {
        this.requests = requests.filter(i => i.requestType === 2).slice(0, 1);
    }),
    makeSupplier: action.bound(function() {
        this.requests = requests.filter(i => i.requestType === 1).slice(0, 1);
    }),
    makeCustomerAndSupplier: action.bound(function() {
        const sup = requests.filter(i => i.requestType === 1)[0];
        const cus = requests.filter(i => i.requestType === 2)[0];
        this.requests = [sup, cus];
    }),

    // Side
    mySide: 1, // bid=1 (for Supplier), ask=2 (for Customer)
    changeSide: action.bound(function(side) {
        this.mySide = side;
    }),

    showConfirmation: false,
    validationMessage: undefined,

    requestedConfirmationFor: undefined, // 'accept' | 'reject'
    requestId: undefined,

    onCreateRequest: action.bound(function() {
        this.eventCounter.onCreateRequest++;
    }),
    onCancelRequest: action.bound(function(reqId) {
        this.eventCounter.onCancelRequest++;
        console.log(`: ${reqId}`);
    }),
    onChangeRequest: action.bound(function(reqId) {
        this.eventCounter.onChangeRequest++;
        console.log(`: ${reqId}`);
    }),
    onRejectRequest: action.bound(function(reqId) {
        this.requestId = reqId;
        this.requestedConfirmationFor = 'reject';
        this.showConfirmation = true;
        console.log(`Reject requested: ${reqId}`);
    }),
    onAcceptRequest: action.bound(function(reqId) {
        this.requestId = reqId;
        this.requestedConfirmationFor = 'accept';
        this.showConfirmation = true;
        console.log(`Accept requested: ${reqId}`);
    }),
    onSubmit: action.bound(function(p) {
        if (p !== password) {
            this.validationMessage = 'Incorrect password';
        } else {
            switch (this.requestedConfirmationFor) {
                case 'reject':
                    this.eventCounter.onSubmitReject++;
                    console.log(`Request ${this.requestId} Rejected`);
                    break;
                case 'accept':
                    this.eventCounter.onSubmitAccept++;
                    console.log(`Request ${this.requestId} Accepted`);
                    break;
            }
            this.requestId = undefined;
            this.requestedConfirmationFor = undefined;
            this.showConfirmation = false;
            this.validationMessage = undefined;
        }
    }),
    onConfirmationCancel: action.bound(function() {
        this.showConfirmation = false;
    }),
});

const Container = observer(() => (
    <ChangeRequestList
        requests={state.requests}
        dealParams={{
            price: '123456789012345678',
            duration: 12600,
        }}
        mySide={state.mySide}
        onCreateRequest={state.onCreateRequest}
        onCancelRequest={state.onCancelRequest}
        onChangeRequest={state.onChangeRequest}
        onRejectRequest={state.onRejectRequest}
        onAcceptRequest={state.onAcceptRequest}
        showConfirmation={state.showConfirmation}
        validationMessage={state.validationMessage}
        onSubmit={state.onSubmit}
        onConfirmationCancel={state.onConfirmationCancel}
    />
));

const StateInfo = observer(() => (
    <div>
        <div>password: {password}</div>
        <div>
            My side:
            <button onClick={() => state.changeSide(2)}>Customer</button>
            <button onClick={() => state.changeSide(1)}>Supplier</button>{' '}
            {state.mySide === 1 ? 'Supplier' : 'Customer'}
        </div>
        <div>
            Data presets:
            <button onClick={state.makeEmpty}>Empty</button>
            <button onClick={state.makeCustomer}>Customer</button>
            <button onClick={state.makeSupplier}>Supplier</button>
            <button onClick={state.makeCustomerAndSupplier}>
                Customer and Supplier
            </button>
        </div>
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
