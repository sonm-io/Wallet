'use strict';

module.exports = async function (params) {
  const api = params.api;
  const data = params.data;

  const result = await api.sendToken(data.to, data.amount);

    if ( result ) {
        return {
            data: result,
        };
    } else {
        return {
            error: 'send_token_false',
        };
    }
};