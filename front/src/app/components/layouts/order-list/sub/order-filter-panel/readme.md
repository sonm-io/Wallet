Orders Filter Panel:

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const filterKeys = [
    'orderOwnerType',
    'address',
    'side',
    'onlyActive',
    'priceFrom',
    'priceTo',
    'professional',
    'registered',
    'identified',
    'anonymous',
    'cpuCountFrom',
    'cpuCountTo',
    'gpuCountFrom',
    'gpuCountTo',
    'ramSizeFrom',
    'ramSizeTo',
    'storageSizeFrom',
    'storageSizeTo',
    'ethFrom',
    'ethTo',
    'zCashFrom',
    'zCashTo',
    'redshiftFrom',
    'redshiftTo',
];

const state = observable({
    eventCounter: {
        onApply: 0,
        onUpdateFilter: 0,
    },

    validation: {},

    // filter
    orderOwnerType: 0,
    address: '',
    side: 'Sell',
    onlyActive: false,
    priceFrom: undefined,
    priceTo: undefined,
    // owner status:
    professional: false,
    registered: false,
    identified: false,
    anonymous: false,
    // -
    cpuCountFrom: undefined,
    cpuCountTo: undefined,
    gpuCountFrom: undefined,
    gpuCountTo: undefined,
    ramSizeFrom: undefined,
    ramSizeTo: undefined,
    storageSizeFrom: undefined,
    storageSizeTo: undefined,
    ethFrom: undefined,
    ethTo: undefined,
    zCashFrom: undefined,
    zCashTo: undefined,
    redshiftFrom: undefined,
    redshiftTo: undefined,
    // end filter

    onUpdateFilter: action.bound(function(key, value) {
        console.log(`${key}=${value}`);
        this.eventCounter.onUpdateFilter++;
        this[key] = value;
    }),
});

const StateInfo = observer(() => (
    <div>
        {filterKeys.map(i => (
            <div>
                {i}: {String(state[i])}
            </div>
        ))}
        <div>
            events:
            {Object.keys(state.eventCounter)
                .map(name => `${name}: ${state.eventCounter[name]}`)
                .join(', ')}
        </div>
    </div>
));

const Container = observer(() => (
    <OrderFilterPanel
        validation={state.validation}
        // filter
        orderOwnerType={state.orderOwnerType}
        address={state.address}
        side={state.side}
        onlyActive={state.onlyActive}
        priceFrom={state.priceFrom}
        priceTo={state.priceTo}
        // owner status:
        professional={state.professional}
        registered={state.registered}
        identified={state.identified}
        anonymous={state.anonymous}
        // -
        cpuCountFrom={state.cpuCountFrom}
        cpuCountTo={state.cpuCountTo}
        gpuCountFrom={state.gpuCountFrom}
        gpuCountTo={state.gpuCountTo}
        ramSizeFrom={state.ramSizeFrom}
        ramSizeTo={state.ramSizeTo}
        storageSizeFrom={state.storageSizeFrom}
        storageSizeTo={state.storageSizeTo}
        ethFrom={state.ethFrom}
        ethTo={state.ethTo}
        zCashFrom={state.zCashFrom}
        zCashTo={state.zCashTo}
        redshiftFrom={state.redshiftFrom}
        redshiftTo={state.redshiftTo}
        // end filter
        onUpdateFilter={state.onUpdateFilter}
    />
));

<div>
    <StateInfo />
    <Container />
</div>;
```
