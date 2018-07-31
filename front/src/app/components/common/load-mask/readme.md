Fullscreen load mask

```js
class LoadMaskPreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadMaskVisible: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!this.state.isLoadMaskVisible) {
            this.setState({ isLoadMaskVisible: true });
            setTimeout(() => this.setState({ isLoadMaskVisible: false }), 5000);
        }
    }

    render() {
        return (
            <LoadMask visible={this.state.isLoadMaskVisible}>
                <button onClick={this.handleClick}>
                    {this.state.isLoadMaskVisible
                        ? 'Please wait for 5 seconds'
                        : 'Show load mask (5 sec)'}
                </button>
            </LoadMask>
        );
    }
}

<LoadMaskPreview />;
```

Region load mask with incorrect parent

```js
<div style={{ position: 'static', width: '300px', height: '150px' }}>
    <LoadMask region white>
        <h1>Text text text</h1>
    </LoadMask>
</div>
```

Region load

```js
<div style={{ position: 'relative', width: '300px', height: '150px' }}>
    <LoadMask region white visible>
        <h1>Text text text</h1>
    </LoadMask>
</div>
```

Big region load

```js
<div style={{ position: 'relative', width: '300px', height: '1000px' }}>
    <LoadMask region white visible>
        <h1>Text text text</h1>
    </LoadMask>
</div>
```
