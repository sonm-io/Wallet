'use strict';

module.exports = async function (api, data) {
  const transaction = api.sendTransaction(data.to, data.qty);

  return {
    success: true,
    data: {
      transaction: transaction,
    },
  };
};

