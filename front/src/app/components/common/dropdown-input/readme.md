date range:

    const { observable, action, useStrict } = mobx;
    const { observer } = mobxReact;

    useStrict()

    const state = observable({
        isExpanded: false,

        toggle: action.bound(function (event, value) {
            this.isExpanded = value !== undefined
                ? value
                : !this.isExpanded;
        }),
    });

    const Container = observer(
        () => <DropdownInput
            valueString='Dropdown input'
            isExpanded={state.isExpanded}
            onButtonClick={state.toggle}
            onRequireClose={state.toggle.bind(state, null, false)}
        >
            <div>DROPDOWN CONTENT</div>
        </DropdownInput>
    );

    <Container />
