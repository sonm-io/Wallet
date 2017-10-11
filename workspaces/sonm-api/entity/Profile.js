'use strict';

const get = require('lodash/fp/get');
const invariant = require('fbjs/lib/invariant');
const Entity = require('./_Entity');

const getBalance = get('c[0][0]');
const SNMT = 'snmt';

class Profile extends Entity {
  constructor({ provider, address0x, ethQtyUnit = 'wei', snmtContract }) {
    super(provider, { [SNMT]: snmtContract });

    invariant(address0x, 'address is not defined');
    invariant(address0x.startsWith('0x'), 'address should starts with 0x');

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
    const result = await this.getContract(SNMT).balanceOf(this.address);

    return await getBalance(result).toString();
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

  sendTokens(addressTo, amount) {
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
    const signed = await this.web3.eth.signTransaction(tx);

    return this.web3.eth.sendSignedTransaction(signed);
  }
}

module.exports = Profile;