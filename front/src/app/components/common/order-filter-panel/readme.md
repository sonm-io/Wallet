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

    const StateInfo = observer(() =>
        <div>
            <div>orderOwnerType: {String(state.orderOwnerType)}</div>
            <div>address: {String(state.address)}</div>
            <div>type: {String(state.type)}</div>
            <div>onlyActive: {String(state.onlyActive)}</div>
            <div>priceFrom: {String(state.priceFrom)}</div>
            <div>priceTo: {String(state.priceTo)}</div>
            // owner status:
            <div>professional: {String(state.professional)}</div>
            <div>registered: {String(state.registered)}</div>
            <div>identified: {String(state.identified)}</div>
            <div>anonymous: {String(state.anonymous)}</div>
            // -
            <div>cpuCountFrom: {String(state.cpuCountFrom)}</div>
            <div>cpuCountTo: {String(state.cpuCountTo)}</div>
            <div>gpuCountFrom: {String(state.gpuCountFrom)}</div>
            <div>gpuCountTo: {String(state.gpuCountTo)}</div>
            <div>ramSizeFrom: {String(state.ramSizeFrom)}</div>
            <div>ramSizeTo: {String(state.ramSizeTo)}</div>
            <div>storageSizeFrom: {String(state.storageSizeFrom)}</div>
            <div>storageSizeTo: {String(state.storageSizeTo)}</div>
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
