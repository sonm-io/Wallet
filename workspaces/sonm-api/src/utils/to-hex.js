module.exports = function toHex(val) {
  let result;

  if (typeof val === 'string' && val.startsWith('0x')) {
    result = val;
  } else if (typeof val === 'number') {
    result = '0x' + val.toString(16);
  } else if (val !== null && typeof val === 'object' && val.constructor.name === 'BigNumber') {
    result = '0x' + val.toString(16);
  }

  return result;
};