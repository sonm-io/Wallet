### BUY

```js
const data = require('../../mock-data.js');

<DealListItem deal={data[0]} buyOrSell="buy" pendingChangeExists={false} />;
```

### SELL & pendingChangeExists

```js
const data = require('../../mock-data.js');

<DealListItem deal={data[1]} buyOrSell="sell" pendingChangeExists={true} />;
```

### Finished

```js
const data = require('../../mock-data.js');

<DealListItem deal={data[2]} buyOrSell="sell" pendingChangeExists={false} />;
```
