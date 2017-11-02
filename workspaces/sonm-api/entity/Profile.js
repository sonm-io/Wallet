'use strict';

const get = require('lodash/fp/get');
// const invariant = require('fbjs/lib/invariant');
const Entity = require('./Entity');

const getBalance = get('c[0][0]');
const SNMT = 'snmt';

class Profile extends Entity {
  constructor(user, ethUnit, snmtContract) {
    super({ [SNMT]: snmtContract });

    this.user = user;
    this.unit = ethUnit;
  }

  async getBalance() {
    return this.web3.utils.fromWei(
      await this.web3.eth.getBalance(this.getAddress()),
      this.unit
    );
  }

  async getTokenBalance() {
    const result = await this.getContract(SNMT).balanceOf(this.user.address);

    return getBalance(result).toString();
  }

  getAddress() {
    return this.user.address;
  }

  getGasLimitWei() {
    return 32000;
  }

  getGasPriceWei() {
    return 100000;
  }

  sendToken(addressTo, amount) {
    return this.getContract(SNMT).transfer(
      addressTo,
      this.web3.utils.toHex(amount),
      { from: this.getAddress() }
    );
  }

  sendEther(addressTo, amount) {
    const tx = {
      from: this.getAddress(),
      gasLimit: this.getGasLimitWei(),
      gasPrice: this.getGasPriceWei(),
      value: this.web3.utils.toWei(amount, this.unit),
      to: addressTo,
    };

    return this.web3.eth.sendTransaction(tx);
  }
}

module.exports = new Profile();