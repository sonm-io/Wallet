Radio button group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const state = observable({
        value: 'normal',
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <ToggleButtonGroup
            value={state.value}
            values={[
                'low',
                'normal',
                'high'
            ]}
            onChange={state.onChange}
            elementCtor={ToggleButton}
        />
    );

    <Container />
