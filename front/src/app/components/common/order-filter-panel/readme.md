Orders Filter Panel:

 const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

    const state = observable({
        eventCounter: {
            onApply: 0,
            onUpdateFilter: 0
        },

        // filter
        orderOwnerType: 0,
        address: '',
        type: undefined,
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
        // end filter

        onApply: action.bound(function () {
            this.eventCounter.onApply++;
        }),
        onUpdateFilter: action.bound(function (key, value) {
            this.eventCounter.onUpdateFilter++;
            this[key] = value;
        })
    });

    const toStr = (value) => {
        return value === undefined
            ? 'undefined'
            : value === null
            ? 'null'
            : value.toString();
    }

    const StateInfo = observer(() =>
        <div>
            <div>orderOwnerType: {toStr(state.orderOwnerType)}</div>
            <div>address: {toStr(state.address)}</div>
            <div>type: {toStr(state.type)}</div>
            <div>onlyActive: {toStr(state.onlyActive)}</div>
            <div>priceFrom: {toStr(state.priceFrom)}</div>
            <div>priceTo: {toStr(state.priceTo)}</div>
            // owner status:
            <div>professional: {toStr(state.professional)}</div>
            <div>registered: {toStr(state.registered)}</div>
            <div>identified: {toStr(state.identified)}</div>
            <div>anonymous: {toStr(state.anonymous)}</div>
            // -
            <div>cpuCountFrom: {toStr(state.cpuCountFrom)}</div>
            <div>cpuCountTo: {toStr(state.cpuCountTo)}</div>
            <div>gpuCountFrom: {toStr(state.gpuCountFrom)}</div>
            <div>gpuCountTo: {toStr(state.gpuCountTo)}</div>
            <div>ramSizeFrom: {toStr(state.ramSizeFrom)}</div>
            <div>ramSizeTo: {toStr(state.ramSizeTo)}</div>
            <div>storageSizeFrom: {toStr(state.storageSizeFrom)}</div>
            <div>storageSizeTo: {toStr(state.storageSizeTo)}</div>
            <div>events: {Object.keys(state.eventCounter).map(name => `${name}: ${state.eventCounter[name]}`).join(', ')}</div>
        </div>
    );

    const Container = observer(() =>
        <OrderFilterPanel
            orderOwnerType={state.orderOwnerType}
            address={state.address}
            type={state.type}
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
            onApply={state.onApply}
            onUpdateFilter={state.onUpdateFilter}
        />
    );

    <div>
        <StateInfo />
        <Container />
    </div>
