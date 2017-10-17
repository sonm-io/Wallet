// const BN = require('bignumber.js');

const MINUTE = 60 * 1000;
const MAX_TIMEOUT = MINUTE * 10;

class TxResult {
    constructor(src, gethClient) {
      if (src instanceof Promise) {
        this.promise = src.then(result => this.processPromiseResult(result));
      } else if (TxResult.checkTxHash(src)) {
        this.hash = src;
      } else {
        throw new Error('Unknown transaction src');
      }
      this.timestamp = Date.now();
      this.geth = gethClient;
      this.receipt = null;
    }

    processPromiseResult(val) {
      if (TxResult.checkTxHash(val)) {
        this.hash = val;
      } else if (val && TxResult.checkTxReceipt(val.receipt)) {
        this.receipt = val.receipt;
        this.hash = val.receipt.transactionHash;
      }
    }

    static checkTxHash(src) {
      return typeof src === 'string' && src.startsWith('0x');
    }

    static checkTxReceipt(src) {
      return src instanceof Object
        && 'cumulativeGasUsed' in src;
    }

    async getHash() {
      await this.promise;

      return this.hash;
    }

    async getTxPrice() {
      const [ receipt, gasPrice ] = await Promise.all([ this.getReceipt(), this.geth.getGasPrice() ]);

      return gasPrice.times(receipt.gasUsed);
    }

    async getReceipt() {
      let result;  

      if (this.promise) {
        await this.promise;
      }

      if (!this.receipt) {
        const hash = await this.getHash();
        const promise = new Promise((done, reject) => {
          const timeoutTask = setTimeout(() => reject(`getReceipt timeout: ${MAX_TIMEOUT}`), MAX_TIMEOUT);

          const check = async () => {
            const result = await this.geth.method('getTransactionReceipt')(hash);

            if (result) {
              clearTimeout(timeoutTask);
              done(result);
            } else {
              setTimeout(check, this.getPollingInterval());
            }
          };

          check();
        });

        await promise.then(receipt => this.receipt = receipt);
      }

      result = this.receipt;

      return result;
    }

    getPollingInterval() {
      const age = Date.now() - this.timestamp;

      const result = age > MINUTE
        ? MINUTE
        : 1000;

      return result;
    }

    async getInfo() {
      return this.geth.method('getTransaction')(await this.getHash());
    }
}

module.exports = TxResult;

