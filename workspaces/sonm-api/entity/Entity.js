'use strict';

const invariant = require('fbjs/invariant');
const Web3 = require('web3');

const _init = Symbol('isInit');
const _contracts = Symbol('contracts');
const _provider = Symbol('provider');
const _web3 = Symbol('_web3');

class Entity {
  constructor(mapNameToContract) {
    this[_init] = false;

    invariant(mapNameToContract, 'mapNameToContract is not defined');

    this[_contracts] = mapNameToContract
      ? Object.assign({}, mapNameToContract)
      : {};
  }

  [_provider] = null;
  get provider() {
    invariant(this[_provider], `api ${this.constructor.name} is not initialized`);
    return this._provider;
  }

  [_web3] = null;
  get web3() {
    invariant(this[_web3], `api ${this.constructor.name} is not initialized`);
    return this._web3;
  }

  init({ provider }) {
    this[_provider] = provider;
    this[_web3] = new Web3(provider);
    for (const contract of this[_contracts]) {
      contract.setProvider(provider);
    }
    this[_init] = true;

    return this;
  }

  getContract(name) {
    return this[_contracts][name];
  }
}

module.exports = new Entity();