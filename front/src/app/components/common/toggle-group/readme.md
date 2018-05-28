Checkbox radio group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    let who;
    const items = [
        who = {
            man: {
                name: 'Peter Parker',
                age: 20,
            },
            hero: 'spiderman',
        }, {
            man: {
                name: 'Bruce Wayne',
                age: 35,
            },
            hero: 'batman',
        }
    ]

    const state = observable({
        value: observable.ref(who),
        onChange: action.bound(function (params) {
            console.log(params.value.hero);

            this.value = params.value;
        }),
    });


    const Container = observer(() =>
        <ToggleGroup
            values={items}
            value={state.value}
            name="hero"
            titlesOrDisplayIndex="man.name"
            onChange={state.onChange}
            elementCtor={Checkbox}
        />
    );

    <Container />

Toggler radio group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const state = observable({
        value: 'normal',
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <ToggleGroup
            value={state.value}
            name="volume2"
            values={[
                'low',
                'normal',
                'high'
            ]}
            onChange={state.onChange}
            elementCtor={Toggler}
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
        <ToggleGroup
            value={state.value}
            values={list.map(i => i.val)}
            titlesOrDisplayIndex={list.map(i => i.text)}
            name="music-genre"
            onChange={state.onChange}
            elementCtor={RadioButton}
        />
    );

    <Container />

Toggle button radio group:

    const { observable, action, useStrict, toJS } = mobx;
    const { observer } = mobxReact;

    const state = observable({
        value: 'normal',
        onChange: action.bound(function (params) {
            this.value = params.value;
        })
    });

    const Container = observer(() =>
        <ToggleGroup
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
