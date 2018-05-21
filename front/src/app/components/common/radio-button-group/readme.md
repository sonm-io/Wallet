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
        <RadioButtonGroup
            value={state.value}
            name="volume"
            values={[
                'low',
                'normal',
                'high'
            ]}
            onChange={state.onChange}
            elementCtor={RadioButton}
        />
    );

    <Container />

Radio button group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const list = [
        { val: 1, text: 'pop' },
        { val: 2, text: 'jazz' },
        { val: 3, text: 'reggae' },
        { val: 4, text: 'rock' },
        { val: 5, text: 'rap' },
    ];

    const state = observable({
        value: list[0].val,
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <RadioButtonGroup
            value={state.value}
            values={list.map(i => i.val)}
            titles={list.map(i => i.text)}
            name="music-genre"
            onChange={state.onChange}
            elementCtor={RadioButton}
        />
    );

    <Container />
