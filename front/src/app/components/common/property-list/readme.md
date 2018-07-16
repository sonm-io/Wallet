PropertyList:

```js
const data = { id: 2, startDate: 'today', timeLeft: 6 };

const config = [
    {
        name: 'Deal ID',
        id: 'id',
    },
    {
        name: 'Start date',
        id: 'startDate',
    },
    {
        name: 'Time left',
        id: 'timeLeft',
        renderValue: value => `${value} H`,
    },
    {
        type: 'composite',
        name: 'Computed value',
        render: data => `${data.id} = ${data.timeLeft} H`,
    },
];

<PropertyList
    title="Title Title Title Title Title Title Title Title Title Title Title Title"
    data={data}
    config={config}
/>;
```
