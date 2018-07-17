sample

```js
const data = require('./mock-data.js');
const { DealListView } = require('./view');

const emptyFn = () => {};

const filterPanel = (
    <DealFilterPanel
        query={''}
        dateRange={[new Date(), new Date()]}
        onlyActive={false}
        onUpdateFilter={emptyFn}
    />
);

<DealListView
    data={data}
    marketAccountAddress={'0xDb12524EfaF41AA1A7beC813E0c5666722894166'}
    onClickRow={id => console.log(id)}
    filterPanel={filterPanel}
/>;
```
