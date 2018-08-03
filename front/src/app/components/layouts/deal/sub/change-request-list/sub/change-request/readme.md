### States demo

With price and duration. Customer. Cancel+Change.

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 1,
        duration: 12700,
        price: '15345678901234567',
        status: 1,
        createdAt: new Date(),
    }}
    state={0}
/>
```

With price. Supplier. Reject+Accept.

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 2,
        price: '15345678901234567',
        status: 1,
        createdAt: new Date(),
    }}
    state={1}
/>
```

With duration. Customer. No buttons.

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 1,
        duration: 12400,
        status: 1,
        createdAt: new Date(),
    }}
    state={2}
/>
```

### hasAdvantage

Request price lower. buy. mySide. => true

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 1,
        price: '23456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={0}
/>
```

Request price lower. buy. otherSide. => false

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 1,
        price: '23456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={1}
/>
```

Request price lower. sell. mySide. => false

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 2,
        price: '23456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={0}
/>
```

Request price lower. sell. otherSide. => true

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 2,
        price: '23456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={1}
/>
```

Request price greater. buy. mySide. => false

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 1,
        price: '923456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={0}
/>
```

Request price greater. buy. otherSide. => true

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 1,
        price: '923456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={1}
/>
```

Request price greater. sell. mySide. => true

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 2,
        price: '923456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={0}
/>
```

Request price greater. sell. otherSide. => false

```js
<ChangeRequest
    dealParams={{
        price: '123456789012345678',
        duration: 12600,
    }}
    request={{
        id: 1,
        requestType: 2,
        price: '923456789012345678',
        status: 1,
        createdAt: new Date(),
    }}
    state={1}
/>
```
