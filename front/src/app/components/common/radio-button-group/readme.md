Radio button group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const state = observable({
        value: 'normal',
        onChange: action.bound(function (value) {
            this.value = value;
        })
    });

    const Container = observer(() =>
        <RadioButtonGroup
            value={state.value}
            valueList={[
                'low',
                'normal',
                'high'
            ]}
            onChange={state.onChange}
            elementCtor={RadioButton}
        />
    );

    <Container />
