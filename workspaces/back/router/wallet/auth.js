'use strict';

const keythereum = require("keythereum");

module.exports = async function(app) {
    console.log('111');

    const datadir = "/Users/dmitrypisanko/Library/Ethereum/rinkeby";
    const keyObject = keythereum.importFromFile('23ea8516453f743b729a57b53369a6b50d98ae2c', datadir);

    const privateKey = keythereum.recover('11111111', keyObject);

    console.log(keyObject);
    console.log(privateKey);
    console.log(privateKey.toString('hex'));
};