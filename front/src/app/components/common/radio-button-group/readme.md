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
            name="volume-123"
            values={[
                'low',
                'normal',
                'high'
            ]}
            onChange={state.onChange}
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

    const values = list.map(i => i.val);

    const titles = list.map(i => i.text);

    const state = observable({
        value: list[0].val,
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <RadioButtonGroup
            value={state.value}
            values={values}
            titlesOrDisplayIndex={titles}
            name="music-genre-123"
            onChange={state.onChange}
        />
    );

    <Container />
