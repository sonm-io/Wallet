const expect = require('chai').expect;
const sonmApi = require('../index');
const keythereum = require('keythereum');
const BN = require('bignumber.js');

const { createProfile } = sonmApi;

const URL_REMOTE_GETH_NODE  = 'https://rinkeby.infura.io';

const vasyaCfg = require('../../../data/Vasya_11111111.json');
const petyaCfg = require('../../../data/Petya_qazwsxedc.json');

vasyaCfg.privateKey = keythereum.recover('11111111', vasyaCfg);
petyaCfg.privateKey = keythereum.recover('qazwsxedc', petyaCfg);

console.log('Creating test profiles...');
const VASYA = createProfile(URL_REMOTE_GETH_NODE, vasyaCfg.address, vasyaCfg.privateKey);
const PETYA = createProfile(URL_REMOTE_GETH_NODE, petyaCfg.address, petyaCfg.privateKey);
console.log('done');

describe('Profile entity', function() {
  xdescribe('tokens', function() {
    it('should send sonm tokens from VASYA to PETYA', async function() {
      this.timeout(+Infinity);
  
      const qty = 2;
  
      const vasyaBalance = await VASYA.getTokenBalance();
      const petyaBalance = await PETYA.getTokenBalance();
      console.log('Vasya: ', vasyaBalance, 'Petya: ', petyaBalance);
  
      const tx = VASYA.getTxIterator(VASYA.sendTokens(PETYA, qty));
  
      expect(await VASYA.getTokenBalance()).toEqual(vasyaBalance - qty);
      expect(await PETYA.getTokenBalance()).toEqual(petyaBalance + qty);
    });
  });

  describe('ether', function() {
    it('should send ether from VASYA to PETYA', async function() {
      this.timeout(+Infinity);
  
      const qty = '1';
  
      const vasyaBalance = await VASYA.getBalance();
      const petyaBalance = await PETYA.getBalance();
      console.log('Vasya: ', vasyaBalance, 'Petya: ', petyaBalance);
  
      const tx = VASYA.getTxIterator(VASYA.sendEther(PETYA, qty));
  
      await tx;

      expect(await VASYA.getBalance()).equal(new BN(vasyaBalance).minus(qty).toString());
      expect(await PETYA.getBalance()).equal(new BN(vasyaBalance).plus(qty).toString());
    });
  });
});


