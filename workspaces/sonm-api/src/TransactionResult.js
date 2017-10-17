// const BN = require('bignumber.js');

const MINUTE = 60 * 1000;
const MAX_TIMEOUT = MINUTE * 10;

class TxResult {
    constructor(src, gethClient) {
      this._timestamp = Date.now();
      this._geth = gethClient;
      this._receipt = null;
      this._hash = null;
      this._promise = null;

      if (src instanceof TxResult) {
        this._copyCtr(src);
      } else if (src instanceof Promise) {
        this._promise = src.then(result => this._processPromiseResult(result));
      } else if (TxResult.checkTxHash(src)) {
        this._hash = src;
      } else {
        throw new Error('Unknown transaction src');
      }
    }

    _copyCtr(txResult) {
      if (txResult._hash) {
        this._hash = txResult._hash;
      } else {
        this._promise = txResult._promise.then(result => this._processPromiseResult(result));
      }
    }

    _processPromiseResult(val) {
      if (TxResult.checkTxHash(val)) {
        this._hash = val;
      } else if (val && TxResult.checkTxReceipt(val.receipt)) {
        this._receipt = val.receipt;
        this._hash = val.receipt.transactionHash;
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
      await this._promise;

      return this._hash;
    }

    async getTxPrice() {
      const [ receipt, gasPrice ] = await Promise.all([ this.getReceipt(), this._geth.getGasPrice() ]);

      return gasPrice.mul(receipt.gasUsed);
    }

    async getReceipt() {
      let result;  

      await this._promise;

      if (!this._receipt) {
        const hash = await this.getHash();
        const promise = new Promise((done, reject) => {
          const timeoutTask = setTimeout(() => reject(`getReceipt timeout: ${MAX_TIMEOUT}`), MAX_TIMEOUT);

          const check = async () => {
            const result = await this._geth.method('getTransactionReceipt')(hash);

            if (result) {
              clearTimeout(timeoutTask);
              done(result);
            } else {
              setTimeout(check, this._getPollingInterval());
            }
          };

          check();
        });

        await promise.then(receipt => this._receipt = receipt);
      }

      result = this._receipt;

      return result;
    }

    _getPollingInterval() {
      const age = Date.now() - this.timestamp;

      const result = age > MINUTE
        ? MINUTE
        : 1000;

      return result;
    }

    async getInfo() {
      return this._geth.method('getTransaction')(await this.getHash());
    }
}

module.exports = TxResult;

