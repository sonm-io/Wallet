'use strict';

module.exports = async function(params) {
  const market = params.market;

  const res = await market.getOrderById().sendMessage({id: 'f815e9cc-c107-44ef-b538-049aea0fee29'});
  console.log(res);
};