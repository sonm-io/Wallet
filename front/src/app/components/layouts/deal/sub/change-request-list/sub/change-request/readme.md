With price and duration. Supplier. Cancel+Change.

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

With price. Customer. Reject+Accept.

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

With duration. Supplier. No buttons.

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
