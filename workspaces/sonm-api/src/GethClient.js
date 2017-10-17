const Web3 = require('web3');
const invariant = require('fbjs/lib/invariant');
const TransactionResult = require('./TransactionResult');
const createAsyncMethods = require('./utils/create-async-web3-methods.js');

module.exports = class GethClient {
  constructor(provider) {
    invariant(provider, 'provider is not defined');

    this.web3 = new Web3(provider);
    this.methods = {};
    this.gasPrice = null;
  }

  method(methodName) {
    if (!this.methods[methodName]) {
      Object.assign(
        this.methods,
        createAsyncMethods(this.web3, methodName)
      );
    }

    return this.methods[methodName];
  }

  async getGasPrice(force) {
    if (force || !this.gasPrice) {
      this.gasPrice = await this.method('getGasPrice')();
    }

    return this.gasPrice;
  }

  async sendTransaction(web3tx) {
    const hash = await this.method('sendTransaction')(web3tx);

    return new TransactionResult(hash, this);
  }
};