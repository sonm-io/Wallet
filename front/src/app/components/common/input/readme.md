Input:

    <Input />

Input with prefix:

    <div style={{ display: 'grid', 'gridTemplateColumns': '200px 200px', 'gap': '10px' }}>

        <Input prefix="from" />
        <Input prefix="to" />

    </div>

Input debounced:

    <Input onChange={(...a) => console.log(JSON.stringify(a))} debounceInterval={1000} name="name"/>

Input debounced:

    <div style={{ background: '#000', padding: '10px' }} className="sonm-input--in-the-dark">
        <Input
            onChange={(...a) => console.log(JSON.stringify(a))}
            debounceInterval={1000}
            name="name"
            prefix="prefix"
        />
    </div>
