'use strict';

module.exports = async function (api, data) {
  api.sendTransaction(data.to, data.qty).then( result => {
    console.log(result);
  }).catch( err => {
    console.log(err);
  });

  return {
      done: false,
      success: true,
  };

  // const result = await api.sendToken(data.to, data.amount);
  //
  // if ( result ) {
  //   return {
  //     success: true,
  //   }
  // } else {
  //   return {
  //     error: 'send_token_false',
  //   }
  // }
};

