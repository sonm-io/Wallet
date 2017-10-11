const expect = require('chai').expect;
const sonmApi = require('../index');
const keythereum = require('keythereum');

const { createProfile } = sonmApi;

const URL_REMOTE_GETH_NODE  = 'https://rinkeby.infura.io';

const vasyaCfg = require('../../../data/Vasya_11111111.json');
const petyaCfg = require('../../../data/Petya_qazwsxedc.json');

let VASYA;
let PETYA;

before(async () => {
  vasyaCfg.privateKey = keythereum.recover('11111111', vasyaCfg);
  petyaCfg.privateKey = keythereum.recover('qazwsxedc', petyaCfg);

  VASYA = createProfile(URL_REMOTE_GETH_NODE, vasyaCfg.address, vasyaCfg.privateKey);
  PETYA = createProfile(URL_REMOTE_GETH_NODE, petyaCfg.address, petyaCfg.privateKey);
});

describe('send tokens', () => {
  it('should send sonm tokens from VASYA to PETYA', async () => {
    const qty = 2;

    const vInitBalance = await VASYA.getTokenBalance();
    const pInitBalance = await PETYA.getTokenBalance();

    await VASYA.sendTokens(PETYA, qty);

    const vNewBalance = await VASYA.getTokenBalance();
    const pNewBalance = await PETYA.getTokenBalance();

    expect(vNewBalance).toEqual(vInitBalance - qty);
    expect(pNewBalance).toEqual(pInitBalance + qty);
  });
});

