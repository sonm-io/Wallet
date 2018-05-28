Interactivity:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const validPassword = 'trustme';

    const state = observable({
        eventCounter: {
            onCancel: 0,
            onSubmit: 0
        },
        validationMessage: '',
        lastPassword: '',
        onCancel: action.bound(function () {
            this.eventCounter.onCancel++;
        }),
        onSubmit: action.bound(function (password) {
            this.eventCounter.onSubmit++;
            this.lastPassword = password;
            this.validationMessage = password !== validPassword
                ? this.validationMessage = 'Password is incorrect'
                : '';
        })
    });

    const Container = observer(() =>
        <ConfirmationPanel
            onSubmit={state.onSubmit}
            onCancel={state.onCancel}
            validationMessage={state.validationMessage}
        />
    );

    const StateInfo = observer(() =>
        <div>
            <div>Valid password: {validPassword}</div>
            <div>onCancel: {state.eventCounter.onCancel}</div>
            <div>onSubmit: {state.eventCounter.onSubmit}</div>
            <div>Last submitted password: {state.lastPassword}</div>
        </div>
    );

    <div>
        <StateInfo />
        <Container />
    </div>

In container:

    const containerStyle = {
        width: '230px',
        height: '280px',
        background: '#fafafa',
    };

    <div style={containerStyle}>
        <ConfirmationPanel onSubmit={() => {}} onCancel={() => {}} />
    </div>
