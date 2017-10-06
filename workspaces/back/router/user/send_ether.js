'use strict';

module.exports = async function (params) {
  const api = params.api;
  const data = params.data;

  const transaction = await api.sendEther(data.to, data.qty);

  return {
    data: {
      transaction: transaction,
    },
  };
};

