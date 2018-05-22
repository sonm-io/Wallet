Toggle button group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const values = [
       'low',
       'normal',
       'high',
    ];

    const state = observable({
        value: 'normal',
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <ToggleButtonGroup
            value={state.value}
            values={values}
            onChange={state.onChange}
        />
    );

    <Container />
