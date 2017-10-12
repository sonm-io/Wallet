'use strict';

const get = require('lodash/fp/get');
const invariant = require('fbjs/lib/invariant');
const Entity = require('./_Entity');
const Web3 = require('web3');

const getBalance = get('c[0]');

class Profile extends Entity {
  constructor({ provider, address0x, ethQtyUnit = 'wei', snmtContract }) {
    super();

    invariant(provider, 'provider is not defined');
    invariant(snmtContract && snmtContract.constructor.name === "TruffleContract", 'snmtContract is not valid');
    invariant(address0x, 'address is not defined');
    invariant(address0x.startsWith('0x'), 'address should starts with 0x');

    this.web3 = new Web3(provider);
    this.contract = snmtContract;
    this.address = address0x;
    this.unit = ethQtyUnit;
  }

  async getBalance() {
    return this.web3.utils.fromWei(
      await this.web3.eth.getBalance(this.getAddress()),
      this.unit
    );
  }

  async getTokenBalance() {
    const result = await this.contract.balanceOf(this.address);

    return String(await getBalance(result));
  }

  getAddress() {
    return this.address;
  }

  getGasLimitWei() {
    return 32000;
  }

  getGasPriceWei() {
    return 100000;
  }

  sendTokens(to, amount) {
    return this.contract.transfer(
      this.normalizeTarget(to),
      this.web3.utils.toHex(amount),
      { from: this.getAddress() }
    );
  }

  sendEther(to, amount) {
    const tx = {
      from: this.getAddress(),
      gasLimit: this.getGasLimitWei(),
      gasPrice: this.getGasPriceWei(),
      value: this.web3.utils.toWei(amount, this.unit),
      to: this.normalizeTarget(to),
    };
    return this.web3.eth.sendTransaction(tx);
  }

  normalizeTarget(to) {
    return to instanceof Profile
      ? to.address
      : to; 
  }
}

module.exports = Profile;