const providerFactory = require('./src/provider/signer-provider-factory');
const Profile = require('./src/entity/Profile');
const config = require('./config');
const snmtContractJson = require('@sonm/test-contract/build/contracts/SNMT.json');
const contract = require('truffle-contract');
const add0x = require('./src/utils/add-0x');
const GethClient = require('./src/GethClient');
const memoize = require('./src/utils/memoization');

const snmtContractAddr = config.contractAddress.SNMT;
const snmtContract = contract(snmtContractJson);

const createGethClient = memoize(function createGethClient(provider) {
  return new GethClient(provider);
});

const createProvider = memoize(providerFactory);

/**
 * create API entity Profile 
 * @param {string} remoteEthNodeUrl 
 * @param {string} address
 * @param {string} privateKey 
 */
function createProfile(remoteEthNodeUrl, address, privateKey, params = {}) {
  const address0x = add0x(address);
  const privateKey0x = add0x(privateKey);
  const provider = createProvider(remoteEthNodeUrl, address0x, privateKey0x);
  const gethClient = createGethClient(provider);

  snmtContract.setProvider(provider);

  const ctrArguments = {
    provider,
    address0x,
    gethClient,
    snmtContract: snmtContract.at(snmtContractAddr),
  };

  Object.assign(ctrArguments, params);

  return new Profile(ctrArguments);
}

module.exports = {
  createProfile,
  createProvider,
  createGethClient,
};

