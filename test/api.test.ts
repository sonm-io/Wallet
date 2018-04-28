const { expect } = require('chai');

const walletName = 'wallet 1';
const walletPassword = 'my secret key';
const tokenAddress = '0x225b929916daadd5044d5934936313001f55d8f0';
const vasyaCfg = require('./data/Vasya_11111111.json');
const address = `0x${vasyaCfg.address}`;
const json = JSON.stringify(vasyaCfg);
const accountName = 'Account 1';
const password = '11111111';

import { THistorySourceMode } from 'app/stores/types';

import { Api } from 'app/api';

before(async function() {
    this.timeout(+Infinity);
    localStorage.clear();
});
describe('Api', async function() {
    this.timeout(+Infinity);

    it('should ping', async function() {
        const response = await Api.ping();
        expect(response).to.have.nested.property('data.pong');
    });

    it('should get merket profiles', async function() {
        const response = await Api.getProfileList();
        expect(response).to.have.nested.property('data.records');
        expect(response).to.have.nested.property('data.total');

        if (response.data) {
            const response1 = await Api.getProfile(
                response.data.records[1].address,
            );
            expect(response1).to.have.nested.property('data.name');
            expect(response1).to.have.nested.property('data.address');
        }
    });

    it('should get market orders profiles', async function() {
        const response = await Api.getOrderList();
        expect(response).to.have.nested.property('data.records');

        if (response.data) {
            const response1 = await Api.getOrder(response.data.records[0].id);
            expect(response1).to.have.nested.property('data.id');
            expect(response1).to.have.nested.property('data.orderType');
        }
    });

    it('should get empty wallets list', async function() {
        const response = await Api.getWalletList();
        expect(response.data).to.have.lengthOf(0);
    });

    it('should set secret key', async function() {
        const response = await Api.createWallet(
            walletPassword,
            walletName,
            'rinkeby',
        );
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
            expect(response.data[1].symbol).equal('SNM');
        }
    });

    it('should recieve market balance', async function() {
        const response = await Api.getMarketBalance(address);
        expect(response.data).not.equal(null);
    });

    it('should recieve token exchange', async function() {
        const response = await Api.getTokenExchangeRate();
        expect(response.data).not.equal(null);
    });

    it('should get token info', async function() {
        const response = await Api.getTokenInfo(tokenAddress, [address]);
        expect(response.data).to.have.property('name');
        expect(response.data).to.have.property('balance');

        const response2 = await Api.getTokenInfo(
            '0x225b929916daadd5044d5934936313001f55d8f1',
        );
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
        const response = await Api.getPresetTokenList();
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

    it('should create account', async function() {
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
            const walletImportName = 'wallet 2';

            const response2 = await Api.importWallet(
                walletPassword,
                walletImportName,
                response.data,
            );
            expect(response2).to.have.nested.property(
                'data.name',
                walletImportName,
            );
            expect(response2).to.have.nested.property('data.chainId');
            expect(response2).to.have.nested.property('data.nodeUrl');

            const response3 = await Api.getWalletList();
            expect(response3.data).to.have.lengthOf(2);
        }
    });

    it('should check private key', async function() {
        const response = await Api.getPrivateKey(password, address);
        expect(response.data).equal(
            '69deaef1da6fd4d01489d7b46e8e3aab587d9fcd49de2080d367c3ef120689ef',
        );
    });

    it('should fail check private key', async function() {
        const response = await Api.getPrivateKey('1234', address);
        expect(response).to.have.nested.property('validation.password');
    });

    it('should deposit', async function() {
        const currencies = await Api.getCurrencyList();
        expect(currencies.data).not.equal(null);
        if (currencies.data) {
            const tx = {
                timestamp: new Date().valueOf(),
                fromAddress: address,
                toAddress: address,
                amount: '10',
                gasLimit: '100000',
                gasPrice: '200000000000',
                currencyAddress: currencies.data[1].address,
            };

            const response = await Api.deposit(tx, password);
            expect(response.data).not.equal(null);
        }
    });

    it('should withdraw', async function() {
        const currencies = await Api.getCurrencyList();
        expect(currencies.data).not.equal(null);
        if (currencies.data) {
            const tx = {
                timestamp: new Date().valueOf(),
                fromAddress: address,
                toAddress: address,
                amount: '10',
                gasLimit: '100000',
                gasPrice: '200000000000',
                currencyAddress: currencies.data[1].address,
            };

            const response = await Api.withdraw(tx, password);
            expect(response.data).not.equal(null);
        }
    });

    it('should send ether and snm', async function() {
        const amount = '2';
        const to = 'fd0c80ba15cbf19770319e5e76ae05012314608f';
        const tx = {
            timestamp: new Date().valueOf(),
            fromAddress: address,
            toAddress: to,
            amount,
            currencyAddress: '0x',
            gasLimit: '50000',
            gasPrice: '100000000000',
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
                expect(transactions[0].currencySymbol).equal('Ether');
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
                        expect(transactions2[0].currencyAddress).equal(
                            currencies.data[1].address,
                        );
                        expect(transactions2[0].currencySymbol).equal('SNM');
                    }
                }
            }
        }
    });

    it('should filter transactions', async function() {
        const currencies = await Api.getCurrencyList();
        expect(currencies.data).not.equal(null);

        if (currencies.data) {
            const response = await Api.getSendTransactionList(
                THistorySourceMode.wallet,
                {
                    currencyAddress: currencies.data[1].address,
                },
            );
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

    it('should remove account', async function() {
        const response1 = await Api.removeAccount(address);
        expect(response1.data).equal(true);

        const response2 = await Api.getAccountList();
        expect(response2.data).to.have.lengthOf(0);
    });

    it('should create account from privateKey', async function() {
        const privateKey =
            '69deaef1da6fd4d01489d7b46e8e3aab587d9fcd49de2080d367c3ef120689ee';

        const response = await Api.createAccount(password, privateKey);
        expect(response.data).to.be.a('string');

        if (response.data) {
            const json1 = JSON.parse(response.data);

            const response1 = await Api.addAccount(
                response.data,
                password,
                'Wallet 2',
            );
            expect(response1.data).not.equal(null);

            const response2 = await Api.getAccountList();
            expect(response2.data).to.have.lengthOf(1);

            const response3 = await Api.getPrivateKey(password, json1.address);
            expect(response3.data).equal(privateKey);
        }
    });
});
