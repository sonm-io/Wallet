ProfileStatus

```js
const { EnumProfileStatus } = require('app/api/types');

const keysCount = Object.keys(EnumProfileStatus).length / 2; // this is specific to typescript Enums.

<React.Fragment>
    {Array.from(Array(keysCount).keys()).map(i => (
        <div>
            <ProfileStatus status={i} /> (key={EnumProfileStatus[i]})
        </div>
    ))}
</React.Fragment>;
```
