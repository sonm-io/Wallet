const providerFactory = require('./provider/signer-provider-factory');
const Profile = require('./entity/Profile');
const config = require('./config');
const snmtContractJson = require('@sonm/test-contract/build/contracts/SNMT.json');
const contract = require('truffle-contract');
const add0x = require('./utils/add-0x');

function createProfile(remoteEthNodeUrl, address, privateKey) {
  const address0x = add0x(address);
  const privateKey0x = add0x(privateKey);
  const provider = providerFactory(remoteEthNodeUrl, address0x, privateKey0x);
  const snmtContractAddr = config.contractAddress.SNMT;
  const snmtContract = contract(snmtContractJson).at(snmtContractAddr);

  return new Profile({
    address0x,
    provider,
    snmtContract,
  });
}

module.exports = {
  createProfile,
};
