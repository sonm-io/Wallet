Order list item:

    const { order } = require ('./mock-data.js');

    <OrdersListItem
      order={order}
      onClick={()=>{}}
    />

With children:

    const { order } = require ('./mock-data.js');
    const child = <Button>Buy</Button>;

    <OrdersListItem
      order={order}
      onClick={()=>{}}
      children={child}
    />
