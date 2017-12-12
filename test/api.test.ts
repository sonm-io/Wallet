const {expect} = require('chai');

const vasyaCfg = require('./data/Vasya_11111111.json');
const json = JSON.stringify(vasyaCfg);

const address = `0x${vasyaCfg.address}`;
const password = '11111111';

import { Api } from 'app/api';

before(async function() {
    this.timeout(+Infinity);

    localStorage.clear();
});
describe('Api',  async function() {
    this.timeout(+Infinity);

    it('should ping', async function() {
        const response = await Api.ping();
        expect(response).to.have.nested.property('data.pong');
    });

    it('should get empty wallets list', async function() {
        const response = await Api.getWalletList();
        expect(response.data).to.have.lengthOf(0);
    });

    it('should set secret key', async function() {
        const response = await Api.setSecretKey('my secret key', 'wallet 1');
        expect(response.data).equal(true);
    });

    it('should get not empty wallets list', async function() {
        const response = await Api.getWalletList();
        expect(response.data).to.have.lengthOf(1);

        const response2 = await Api.setSecretKey('my secret key1', 'wallet 1');
        console.log(response2);
    });

    it('should get error on wrong secret key', async function() {
        const response = await Api.setSecretKey('my secret key1', 'wallet 1');
        expect(response).to.have.nested.property('validation.password');
    });

    it('should return error in add account', async function() {
        const response = await Api.addAccount(json, '1111111', 'Wallet 1');
        expect(response).to.have.nested.property('validation.password');
    });

    it('should recieve gasPrice without account list', async function() {
        const response = await Api.getGasPrice();
        expect(response.data).to.be.a('string');
    });

    it('should create account and recover private key from it', async function() {
        const response = await Api.createAccount('testTestTest');
        expect(response.data).to.be.a('object');
    });

    it('should add account', async function() {
        const name = 'Wallet 1';

        const response1 = await Api.addAccount(json, password, name);
        expect(response1.data).not.equal(null);

        const response2 = await Api.getAccountList();
        expect(response2.data).to.have.lengthOf(1);

        if (response2.data) {
            expect(response2.data[0].name).equal(name);
            expect(response2.data[0].address).equal(address);
        }
    });

    it('should check private key', async function() {
        const response = await Api.checkPrivateKey(password, address);
        expect(response.data).equal(true);
    });

    it('should fail check private key', async function() {
        const response = await Api.checkPrivateKey('1234', address);
        expect(response).to.have.nested.property('validation.password');
    });

    it('should recieve currenciesList', async function() {
        const response = await Api.getCurrencyList();
        expect(response.data).to.have.lengthOf(2);
        if (response.data) {
            expect(response.data[0].symbol).equal('Ether');
            expect(response.data[1].symbol).equal('SNMT');
        }
    });

    it('should send ether and snmt', async function() {
        const amount = '0.000000000000000002';
        const to = 'fd0c80ba15cbf19770319e5e76ae05012314608f';
        const tx = {
            timestamp: new Date().valueOf(),
            fromAddress: address,
            toAddress: to,
            amount,
            currencyAddress: '0x',
            gasLimit: '50000',
            gasPrice: '0.00000005',
        };

        // error transaction
        const response1 = await Api.send(tx, '1111111');
        expect(response1).to.have.nested.property('validation.password');

        const response2 = await Api.send(tx, password);
        expect(response2.data).not.equal(null);

        const response3 = await Api.getSendTransactionList();
        expect(response3.data).not.equal(null);

        if (response3.data) {
            const transactions = response3.data[0];
            const total = response3.data[1];

            expect(total).equal(1);

            if (transactions) {
                expect(transactions[0].fromAddress).equal(address);
                expect(transactions[0].toAddress).equal(to);
                expect(transactions[0].amount).equal(amount);
            }

            const currencies = await Api.getCurrencyList();
            expect(currencies.data).not.equal(null);
            if (currencies.data) {
                tx.currencyAddress = currencies.data[1].address;

                const response4 = await Api.send(tx, password);
                expect(response4.data).not.equal(null);

                const response5 = await Api.getSendTransactionList();
                expect(response5.data).not.equal(null);
                if (response5.data) {
                    const transactions2 = response5.data[0];
                    const total2 = response5.data[1];
                    expect(total2).equal(2);

                    if (transactions2) {
                        expect(transactions2[0].fromAddress).equal(address);
                        expect(transactions2[0].toAddress).equal(to);
                        expect(transactions2[0].amount).equal(amount);
                        expect(transactions2[0].currencyAddress).equal(currencies.data[1].address);
                    }
                }
            }
        }
    });

    it('should filter transactions', async function() {
        const currencies = await Api.getCurrencyList();
        expect(currencies.data).not.equal(null);

        if (currencies.data) {
            const response = await Api.getSendTransactionList({
                currencyAddress: currencies.data[1].address,
            });
            expect(response.data).not.equal(null);

            if (response.data) {
                expect(response.data[0]).to.have.lengthOf(1);
            }
        }
    });

    it('should rename account', async function() {
        const name = 'Wallet 2';

        const response1 = await Api.renameAccount(address, name);
        expect(response1.data).equal(true);

        const response2 = await Api.getAccountList();
        expect(response2.data).to.have.lengthOf(1);

        if (response2.data) {
            expect(response2.data[0].name).equal(name);
            expect(response2.data[0].address).equal(address);
        }
    });

    it('should remove account', async function () {
        const response1 = await Api.removeAccount(address);
        expect(response1.data).equal(true);

        const response2 = await Api.getAccountList();
        expect(response2.data).to.have.lengthOf(0);
    });
});
