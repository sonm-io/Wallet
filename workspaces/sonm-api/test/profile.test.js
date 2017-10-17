const { expect } = require('chai');
const sonmApi = require('../index');
const keythereum = require('keythereum');
const BN = require('bignumber.js');

const { createProfile } = sonmApi;

const URL_REMOTE_GETH_NODE  = 'https://rinkeby.infura.io';

let VASYA, PETYA;

before(async function() {
  this.timeout(+Infinity);

  const vasyaCfg = require('../../../data/Vasya_11111111.json');
  const petyaCfg = require('../../../data/Petya_qazwsxedc.json');

  const recoverKey = (password, params) => new Promise(done => keythereum.recover(password, params, done));

  console.log('Recover private keys...');
  const [vasyaPrivateKey, petyaPrivateKey] = await Promise.all([
    recoverKey('11111111', vasyaCfg), 
    recoverKey('qazwsxedc', petyaCfg),
  ]);
  console.log('done');

  console.log('Creating test profiles...');
  VASYA = createProfile(URL_REMOTE_GETH_NODE, vasyaCfg.address, vasyaPrivateKey.toString('hex'));
  PETYA = createProfile(URL_REMOTE_GETH_NODE, petyaCfg.address, petyaPrivateKey.toString('hex'));
  console.log('done');
});

describe('Profile entity', function() {
  describe('tokens', function() {
    it('should send sonm tokens from VASYA to PETYA', async function() {
      this.timeout(+Infinity);
  
      const qty = 2;
  
      const vasyaBalance = await VASYA.getTokenBalance();
      const petyaBalance = await PETYA.getTokenBalance();

      console.log(`Vasya: ${vasyaBalance.toString()} Petya: ${petyaBalance.toString()}`);

      const txResult = await VASYA.sendTokens(PETYA, qty);

      const receipt = await txResult.getReceipt();
  
      expect('' + await VASYA.getTokenBalance()).equal('' + new BN(vasyaBalance).minus(qty));
      expect('' + await PETYA.getTokenBalance()).equal('' + new BN(petyaBalance).plus(qty));
    });
  });

  xdescribe('ether', function() {
    it('should send ether from VASYA to PETYA', async function() {
      this.timeout(+Infinity);
  
      const qty = '1';

      const vasyaBalance = await VASYA.getBalance();
      const petyaBalance = await PETYA.getBalance();

      console.log(`Vasya: ${vasyaBalance} Petya: ${petyaBalance}`);

      const txResult = await VASYA.sendEther(PETYA, qty);

      await txResult.getReceipt();

      const txPrice = await txResult.getTxPrice();

      expect('' + await VASYA.getBalance()).equal('' + new BN(vasyaBalance).minus(qty).minus(txPrice));
      expect('' + await PETYA.getBalance()).equal('' + new BN(vasyaBalance).plus(qty));
    });
  });
});
