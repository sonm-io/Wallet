'use strict';

module.exports = async function (api, data) {
  const transaction = await api.sendEther(data.to, data.qty);

  return {
    data: {
      transaction: transaction,
    },
  };
};

