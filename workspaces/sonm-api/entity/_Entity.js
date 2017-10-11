'use strict';

const invariant = require('fbjs/lib/invariant');
const Web3 = require('web3');

class Entity {
  constructor(provider, mapNameToContract) {
    invariant(mapNameToContract, 'mapNameToContract is not defined');
    invariant(provider, 'provider is not defined');

    this.contracts = Object.assign({}, mapNameToContract);
    for (const contract in this.contracts) {
      contract.setProvider(provider);
    }

    this.web3 = new Web3(provider);
  }

  getContract(name) {
    return this.contracts[name];
  }

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