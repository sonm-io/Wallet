Fullscreen load mask

```js
const { LoadMaskPreview } = require('./preview.tsx');

<LoadMaskPreview delay={5000} />;
```

Appearance is debounced

```js
const { LoadMaskPreview } = require('./preview.tsx');

<LoadMaskPreview delay={200} />;
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
<div style={{ position: 'relative', width: '300px', height: '2000px' }}>
    <LoadMask region white visible>
        <h1>Text text text</h1>
    </LoadMask>
</div>
```
