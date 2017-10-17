const promisify = require('../utils/callback-to-promise');
const invariant = require('fbjs/lib/invariant');

module.exports = function createAsyncMethods(web3, ...gethMethodNames) {
  return gethMethodNames.reduce((result, name) => {
    invariant(web3.eth[name], `web3.eth.${name} is not exists`);

    result[name] = promisify(web3.eth[name].bind(web3.eth));

    return result;
  }, {});
};
