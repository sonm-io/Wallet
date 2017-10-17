'use strict';

const get = require('lodash/fp/get');
const invariant = require('fbjs/lib/invariant');
const TransactionResult = require('../TransactionResult');
const BN = require('bignumber.js');
const toHex = require('../utils/to-hex');

const getBalance = get('c[0]');
const GAS_LIMIT_DEFAULT = 100000;

class Profile {
  constructor({ gethClient, address0x, snmtContract }) {

    invariant(gethClient, 'gethClient is not defined');
    invariant(snmtContract && snmtContract.constructor.name === "TruffleContract", 'snmtContract is not valid');
    invariant(address0x, 'address is not defined');
    invariant(address0x.startsWith('0x'), 'address should starts with 0x');

    this.geth = gethClient;
    this.contract = snmtContract;
    this.address = address0x;
  }

  async getBalance() {
    const result = await this.geth.method('getBalance')(this.getAddress());

    return result
      ? String(result)
      : result;
  }

  async getTokenBalance() {
    const result = await this.contract.balanceOf(this.address);

    return getBalance(result);
  }

  getAddress() {
    return this.address;
  }

  getGasLimit() {
    return GAS_LIMIT_DEFAULT;
  }

  async sendTokens(to, amount) {
    const qty = toHex(amount);
    const gasLimit = toHex(await this.getGasLimit());
    const gasPrice = toHex(await this.geth.getGasPrice());

    const resultPromise =  this.contract.transfer(
      this.normalizeTarget(to),
      qty,
      {
        from: this.getAddress(),
        gasLimit,
        gasPrice,
      }
    );

    return new TransactionResult(resultPromise, this.geth);
  }

  async sendEther(to, value) {
    const gasLimit = await this.getGasLimit();
    const gasPrice = await this.geth.getGasPrice();

    const tx = {
      from: this.getAddress(),
      gasLimit,
      gasPrice: `0x${gasPrice.toString(16)}`,
      value,
      to: this.normalizeTarget(to),
    };

    return this.geth.sendTransaction(tx);
  }

  normalizeTarget(to) {
    return to instanceof Profile
      ? to.address
      : to; 
  }
}

module.exports = Profile;