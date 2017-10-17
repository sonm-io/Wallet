module.exports = function(str) {
  if (typeof str === 'string' && !str.startsWith('0x')) {
    return '0x' + str;
  }

  return str;
};
