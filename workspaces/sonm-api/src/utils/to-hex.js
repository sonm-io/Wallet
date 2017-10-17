const BN = require('bignumber.js');

module.exports = function toHex(val) {
  let result;

  if (typeof val === 'string' && val.startsWith('0x')) {
    result = val;
  } else {
    result = '0x' + new BN(val).toString(16);
  }

  return result;
};