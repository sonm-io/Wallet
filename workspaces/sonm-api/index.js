'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const contract = require('truffle-contract');
const Web3 = require('web3');
const tx = require('ethereumjs-tx');
const yaml = require('js-yaml');

class Profile {
    constructor( config ) {
        (async () => {
            const configFile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './config/default.yml'), 'utf8'));

            if ( !config.user ) {
                throw new Error('You forget user');
            }

            if ( !config.connectionUrl ) {
                throw new Error('You forget RPC url');
            }

            const environment  = config.environment || 'development';

            this.user = config.user;
            this.provider = new Web3.providers.HttpProvider(config.connectionUrl);
            this.web3 = new Web3(this.provider);

            this.contracts = {};
            const dir = __dirname + '/build/contracts/';
            const files = fs.readdirSync(dir);

            for (const file of files) {
                if ( file.includes(".json") ) {
                    const name = path.basename(file, '.json');

                    try {
                        const contractObject = contract(await fs.readJson(`${dir}${file}`));
                        contractObject.setProvider(this.provider);

                        contractObject.currentProvider.sendAsync = function () {
                            return contractObject.currentProvider.send.apply(contractObject.currentProvider, arguments);
                        };

                        //console.log(contractObject);
                        //console.log(configFile[environment][name]);

                        this.contracts[name] = await contractObject.deployed(); //configFile[environment][name]

                    } catch (err) {
                        console.log('FAILED TO LOAD', file);
                        console.log(err.stack);
                    }
                }
            }
        })();
    }

    init() {

    }

    getBalance() {
        return (async () => {
            return await this.web3.eth.getBalance(this.user.address);
        })();
    }


    getTokenBalance() {
        return (async () => {
            return _.get(await this.contracts['PigToken'].balanceOf(this.user.address), 'c[0]', 0);
        })();
    }

    sendToken( addressTo, amount ) {
        return (async () => {
            const user = this.user;
            const web3 = this.web3;

            const privateKey = new Buffer(user.privateKey, 'hex');

            const txCount = await web3.eth.getTransactionCount(user.address);
            const gasPrice = web3.utils.toWei(100, "gwei");
            const gasLimit = 32000;
            const value = web3.utils.toWei(amount, "ether");

            const gasPriceHex = web3.utils.toHex(gasPrice);
            const gasLimitHex = web3.utils.toHex(gasLimit);
            const valueHex = web3.utils.toHex(value);

            const rawTx = {
                nonce: web3.utils.toHex(txCount),
                from: user.address,
                gasLimit: gasLimitHex,
                gasPrice: gasPriceHex,
                value: valueHex,
                to: addressTo,
                chainId: 4,
            };

            const tx = new tx(rawTx);
            tx.sign(privateKey);

            return await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'));
        })();
    }

    transactionHistory() {
        // const web3 = app.data.web3;
        // const addressFrom = app.data.auth.address;
        //
        // return async function() {
        //
        //     try {
        //         const endBlockNumber = await web3.eth.getBlockNumber();
        //         const startBlockNumber = endBlockNumber - 23000;
        //
        //         console.log(startBlockNumber, endBlockNumber);
        //
        //         for (let i = startBlockNumber; i <= endBlockNumber; i++) {
        //             if (i % 1000 === 0 || 1) {
        //                 console.log("Searching block " + i);
        //             }
        //
        //             const block = await web3.eth.getBlock(i, true);
        //             if (block && block.transactions) {
        //                 for (let ii; i < block.transactions.length; ii++) {
        //                     const e = block.transactions[ii];
        //
        //                     if (addressFrom === e.from) { // && nonce === e.transactionIndex
        //                         // Do something with the trasaction
        //                         console.log("  tx hash          : " + e.hash + "\n"
        //                             + "   nonce           : " + e.nonce + "\n"
        //                             + "   blockHash       : " + e.blockHash + "\n"
        //                             + "   blockNumber     : " + e.blockNumber + "\n"
        //                             + "   transactionIndex: " + e.transactionIndex + "\n"
        //                             + "   from            : " + e.from + "\n"
        //                             + "   to              : " + e.to + "\n"
        //                             + "   value           : " + e.value + "\n"
        //                             + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
        //                             + "   gasPrice        : " + e.gasPrice + "\n"
        //                             + "   gas             : " + e.gas + "\n"
        //                             + "   input           : " + e.input);
        //                     }
        //                 }
        //             }
        //         }
        //
        //     } catch (err) {
        //         console.log(err.stack);
        //     }
        //
        // }
    }
}

module.exports = Profile;