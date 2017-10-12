'use strict';

const invariant = require('fbjs/lib/invariant');

class Entity {
  getTxIterator(web3TxPromise) {
    const updateQueue = [];
    const promiseQueue = [];

    web3TxPromise
      .once('transactionHash', hash => {
        console.log('hash', hash, Date.now());
      })
      .on('confirmation', (confNumber, receipt) => {
        console.log('confNumber', confNumber, Date.now());
        console.log(JSON.stringify(receipt, null, 4));
      })
      .on('error', error => {
        console.log('error', error, Date.now());
      })
      .then(function(receipt){
        // will be fired once the receipt its mined
      });

    return {
      [Symbol.iterator]: {
        next() {
          return {
            value: 'lol',
            done: true,
          };
        },
      },
    };
  }
}

module.exports = Entity;