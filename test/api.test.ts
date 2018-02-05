const {expect} = require('chai');

const walletName = 'wallet 1';
const walletPassword = 'my secret key';
const tokenAddress = '0x225b929916daadd5044d5934936313001f55d8f0';

const vasyaCfg = require('./data/Vasya_11111111.json');
const json = JSON.stringify(vasyaCfg);
const accountName = 'Account 1';
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
        const response = await Api.createWallet(walletPassword, walletName, 'rinkeby');
        expect(response.data).to.be.a('object');

        if (response.data && response.data.name) {
            expect(response.data.name).equal(walletName);
        }
    });

    it('should recieve currenciesList', async function() {
        const response = await Api.getCurrencyList();
        expect(response.data).to.have.lengthOf(2);

        if (response.data) {
            expect(response.data[0].symbol).equal('Ether');
            expect(response.data[1].symbol).equal('SNMT');
        }
    });

    it('should get token info', async function() {
        const response = await Api.getTokenInfo(tokenAddress);
        expect(response.data).to.be.a('object');

        const response2 = await Api.getTokenInfo('0x225b929916daadd5044d5934936313001f55d8f1');
        expect(response2).to.have.nested.property('validation.address');

        const response3 = await Api.getCurrencyList();
        expect(response3.data).to.have.lengthOf(2);
    });

    it('should add token', async function() {
        const response = await Api.addToken(tokenAddress);
        expect(response.data).to.be.a('object');

        const response2 = await Api.getCurrencyList();
        expect(response2.data).to.have.lengthOf(3);
    });

    it('should remove token', async function() {
        const response = await Api.removeToken(tokenAddress);
        expect(response.data).equal(true);

        const response2 = await Api.getCurrencyList();
        expect(response2.data).to.have.lengthOf(2);
    });

    it('should get friendly token list', async function() {
        const response = await Api.getScamTokenList();
        expect(response.data).to.have.lengthOf(1);
    });

    it('should check connection', async function() {
        const response = await Api.checkConnection();
        expect(response.data).equal(true);
    });

    it('should get not empty wallets list', async function() {
        const response = await Api.getWalletList();
        expect(response.data).to.have.lengthOf(1);
    });

    it('should get error on wrong secret key', async function() {
        const response = await Api.unlockWallet('my secret key1', walletName);
        expect(response).to.have.nested.property('validation.password');
    });

    it('should unlock wallet', async function() {
        const response2 = await Api.unlockWallet(walletPassword, walletName);
        expect(response2.data).equal(true);
    });

    it('should return error in add account', async function() {
        const response = await Api.addAccount(json, '1111111', accountName);
        expect(response).to.have.nested.property('validation.password');
    });

    it('should recieve gasPrice without account list', async function() {
        const response = await Api.getGasPrice();
        expect(response.data).to.be.a('string');
    });

    it('should create account and recover private key from it', async function() {
        const response = await Api.createAccount('testTestTest');
        expect(response.data).to.be.a('string');
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

    it('should export wallet && import wallet', async function() {
        const response = await Api.exportWallet();
        expect(response.data).to.be.a('string');

        if (response.data) {
            const response2 = await Api.importWallet(walletPassword, 'wallet 2', response.data);
            expect(response2).to.have.nested.property('data.name');
            expect(response2).to.have.nested.property('data.chainId');
            expect(response2).to.have.nested.property('data.nodeUrl');
            expect(response2).to.have.nested.property('data.name');


            const response3 = await Api.getWalletList();
            expect(response3.data).to.have.lengthOf(2);
        }
    });

    it('should check private key', async function() {
        const response = await Api.getPrivateKey(password, address);
        expect(response.data).equal('69deaef1da6fd4d01489d7b46e8e3aab587d9fcd49de2080d367c3ef120689ef');
    });

    it('should fail check private key', async function() {
        const response = await Api.getPrivateKey('1234', address);
        expect(response).to.have.nested.property('validation.password');
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
