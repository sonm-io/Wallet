const providerFactory = require('./src/provider/signer-provider-factory');
const Profile = require('./src/entity/Profile');
const config = require('./config');
const snmtContractJson = require('@sonm/test-contract/build/contracts/SNMT.json');
const contract = require('truffle-contract');
const add0x = require('./src/utils/add-0x');
const GethClient = require('./src/GethClient');

/**
 * create API entity Profile 
 * @param {string} remoteEthNodeUrl 
 * @param {string} address 
 * @param {string} privateKey 
 */
function createProfile(remoteEthNodeUrl, address, privateKey) {
  const address0x = add0x(address);
  const privateKey0x = add0x(privateKey);
  const provider = providerFactory(remoteEthNodeUrl, address0x, privateKey0x);
  const snmtContractAddr = config.contractAddress.SNMT;
  const snmtContract = contract(snmtContractJson);
  const gethClient = new GethClient(provider);

  snmtContract.setProvider(provider);

  return new Profile({
    provider,
    address0x,
    gethClient,
    snmtContract: snmtContract.at(snmtContractAddr),
  });
}

module.exports = {
  createProfile,
};

