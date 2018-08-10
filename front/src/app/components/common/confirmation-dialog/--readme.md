# ConfirmationDialog

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const validPassword = '11111111';

    const state = observable({
        eventCounter: {
            onCancel: 0,
            onSubmit: 0
        },
        validationMessage: '',
        password: '',
        onCancel: action.bound(function () {
            this.eventCounter.onCancel++;
        }),
        onSubmit: action.bound(function () {
            this.eventCounter.onSubmit++;
            this.validationMessage = state.password !== validPassword
                ? 'Password is incorrect'
                : '';
        }),
        onChange: action.bound(function (params) {
            state[params.name] = params.value;
        }),
    });

    const Container = observer(() =>
        <ConfirmationDialog
                onSubmit={state.onSubmit}
                onCancel={state.onCancel}
                onClose={state.onCancel}
                onChangePassword={state.onChange}
                password={state.password}
                validationMessage={state.validationMessage}
                labelSubheader='Accept change request'
            />
    );

        const StateInfo = observer(() =>
            <div>
                <div>Valid password: {validPassword}</div>
                <div>onCancel: {state.eventCounter.onCancel}</div>
                <div>onSubmit: {state.eventCounter.onSubmit}</div>
                <div>Last submitted password: {state.password}</div>
            </div>
        );

        <div>
            <StateInfo />
            <Container />
        </div>
