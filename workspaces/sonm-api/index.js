'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const contract = require('truffle-contract');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const yaml = require('js-yaml');
const XHR2 = require('xhr2');

class Profile {

    async init(config) {
        const configFile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './config/default.yml'), 'utf8'));

        if (!config.connectionUrl) {
            throw new Error('You forget RPC url');
        }

        if ( config.user ) {
            this.user = config.user;
        }

        const environment = config.environment || 'development';
        this.provider = new Web3.providers.HttpProvider(config.connectionUrl);

        //this.provider._privateKey(config.user.privateKey);

        const web3 = new Web3(this.provider);
        this.web3 = web3;

        this.provider.send = async function (payload, callback) {
            const _this = this;
            const request = new XHR2();

            request.open('POST', this.host, true);
            request.setRequestHeader('Content-Type','application/json');

            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.timeout !== 1) {
                    var result = request.responseText;
                    var error = null;

                    try {
                        result = JSON.parse(result);
                    } catch(e) {
                        console.log(e.stack);

                        //throw e;
                        //error = errors.InvalidResponse(request.responseText);
                    }

                    _this.connected = true;
                    callback(error, result);
                }
            };

            request.ontimeout = function() {
                _this.connected = false;
                callback(errors.ConnectionTimeout(this.timeout));
            };

            try {
                // { jsonrpc: '2.0',
                //     id: 3,
                //     method: 'eth_sendRawTransaction',
                //     params: [ '0xf86b0585174876e800827d0094a1fdfef08324d1865047c206735df2933daf5f7e87b1a2bc2ec50000802ba0daedda45bd129b70f056b555cb84294bfe142697d134021fb2195dd14bd2fb87a02b163ce9120db11eec4889ba0c8c55706d0db8ec2a59096790c0ed34a97134d0' ] }

                if ( payload.method === 'eth_sendTransaction' ) {
                    const txCount = await web3.eth.getTransactionCount(config.user.address);
                    const gasPrice = web3.utils.toWei(100, "gwei");
                    const gasLimit = 64000;

                    const gasPriceHex = web3.utils.toHex(gasPrice);
                    const gasLimitHex = web3.utils.toHex(gasLimit);

                    const rawTx = {
                        nonce: web3.utils.toHex(txCount),
                        from: payload.params[0].from,
                        to: payload.params[0].to,
                        data: payload.params[0].data,
                        chainId: 4,
                        gasLimit: gasLimitHex,
                        gasPrice: gasPriceHex,
                    };

                    const tx = new Tx(rawTx);
                    tx.sign(new Buffer(config.user.privateKey, 'hex'));

                    payload.method = 'eth_sendRawTransaction';
                    payload.params = ['0x' + tx.serialize().toString('hex')];
                }

                console.log('REQUEST 123!!!!', payload);
                request.send(JSON.stringify(payload));
            } catch(error) {
                console.log(error.stack);

                //throw error;
                //this.connected = false;
                //callback(new Web3().helpers.errors.InvalidConnection(this.host));
            }
        };

        this.contracts = {};
        const dir = __dirname + '/build/contracts/';
        const files = fs.readdirSync(dir);

        for (const file of files) {
            if (file.includes(".json")) {
                const name = path.basename(file, '.json');

                try {
                    const contractObject = contract(await fs.readJson(`${dir}${file}`));
                    contractObject.setProvider(this.provider);

                    contractObject.currentProvider.sendAsync = function () {
                        return contractObject.currentProvider.send.apply(contractObject.currentProvider, arguments);
                    };

                    //this.contracts[name] = await contractObject.deployed();
                    //configFile[environment][name]
                    //console.log(configFile[environment][name]);

                    this.contracts[name] = await contractObject.at(configFile[environment][name]);

                    //console.log(this.contracts[name].sendTransaction.toString());

                } catch (err) {
                    console.log('FAILED TO LOAD', file);
                    console.log(err.stack);
                }
            }
        }
    };

    setUser( user ) {
      this.user = user;
    }

    async getBalance( format = 'ether' ) {
        return this.web3.utils.fromWei(await this.web3.eth.getBalance(this.user.address), format);
    }

    async getTokenBalance() {
      return _.get(await this.contracts['SNMT'].balanceOf(this.user.address), 'c[0]', '0').toString();
    }

    async sendToken( to, amount ) {
        return await this.contracts['SNMT'].transfer(to, this.web3.utils.toHex(amount), {from: this.user.address});
    }

    async sendEther(addressTo, amount) {
        const user = this.user;
        const web3 = this.web3;

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

        const tx = new Tx(rawTx);
        tx.sign(this.user.privateKey);

        return await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'));
    }

    async transactionHistory() {
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

module.exports = new Profile();