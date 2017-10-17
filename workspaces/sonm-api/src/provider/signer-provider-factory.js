const SignerProvider = require('ethjs-provider-signer');
const { sign } = require('ethjs-signer');

module.exports = function create(remoteGethNodeUrl, accountAddress0x, privateKey0x) {
  return new SignerProvider(remoteGethNodeUrl, {
    signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey0x, false)),
    accounts: cb => cb(null, [accountAddress0x]),
  });
}

