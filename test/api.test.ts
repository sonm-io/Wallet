const {expect} = require('chai');
const vasyaCfg = require('./data/Vasya_11111111.json');
const json = JSON.stringify(vasyaCfg);
const address = `0x${vasyaCfg.address}`;
const password = '11111111';

import * as api from 'app/api';

before(async function() {
    this.timeout(+Infinity);

    localStorage.removeItem('accounts');
    localStorage.removeItem('transactions');

    await api.methods.setSecretKey('my secret key');
});
describe('Api',  async function() {
    this.timeout(+Infinity);

    it('should return error in add account', async function() {
        const response = await api.methods.addAccount(json, '1111111', 'Wallet 1');
        expect(response).to.have.nested.property('validation.password');
    });

    it('should add account', async function() {
        const name = 'Wallet 1';

        let response = await api.methods.addAccount(json, password, name);
        expect(response.success).equal(true);

        response = await api.methods.getAccountList();
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(1);
        expect(response.data[0].name).equal(name);
        expect(response.data[0].address).equal(address);
    });

    it('should recieve gasPrice', async function() {
        const response = await api.methods.getGasPrice();
        expect(response.success).equal(true);
        expect(response.data).to.be.a('string');
    });

    it('should recieve currenciesList', async function() {
        const response = await api.methods.getCurrencyList();
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(2);
        expect(response.data[0].symbol).equal('wei');
        expect(response.data[1].symbol).equal('snmt');
    });

    it('should send ether and snmt', async function() {
        const qty = '2';
        const to = 'fd0c80ba15cbf19770319e5e76ae05012314608f';

        let response = await api.methods.send(address, '0x', qty, '0x', '', '', '1111111');
        expect(response.success).equal(true);
        expect(response).to.have.nested.property('validation.password');

        response = await api.methods.send(address, to, qty, '0x', '', '', password);
        expect(response.success).equal(true);

        response = await api.methods.getTransactionList();
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(1);
        expect(response.data[0].from_address).equal(address);
        expect(response.data[0].to_address).equal(to);
        expect(response.data[0].qty).equal(qty);
        expect(response.data[0].currency).equal('0x');

        const currencies = await api.methods.getCurrencyList();

        response = await api.methods.send(address, to, qty, currencies.data[1].address, '', '', password);
        expect(response.success).equal(true);

        response = await api.methods.getTransactionList();
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(2);
        expect(response.data[1].from_address).equal(address);
        expect(response.data[1].to_address).equal(to);
        expect(response.data[1].qty).equal(qty);
        expect(response.data[1].currency).equal(currencies.data[1].address);

        // check filters
        response = await api.methods.getTransactionList({
            currency: currencies.data[1].address,
        });
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(1);
    });

    it('should rename account', async function() {
        const name = 'Wallet 2';

        let response = await api.methods.renameAccount(address, name);
        expect(response.success).equal(true);

        response = await api.methods.getAccountList();
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(1);
        expect(response.data[0].name).equal(name);
        expect(response.data[0].address).equal(address);
    });

    it('should remove account', async function() {
        let response = await api.methods.removeAccount(address);
        expect(response.success).equal(true);

        response = await api.methods.getAccountList();
        expect(response.success).equal(true);
        expect(response.data).to.have.lengthOf(0);
    });
});
