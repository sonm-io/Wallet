'use strict';

const keythereum = require("keythereum");
const _ = require("lodash");

module.exports = async function(data) {
    console.log('login');

    return {
        success: true,
    };

    // const datadir = "/Users/dmitrypisanko/Library/Ethereum/rinkeby";
    // const keyObject = keythereum.importFromFile('23ea8516453f743b729a57b53369a6b50d98ae2c', datadir);
    //
    // const privateKey = keythereum.recover('11111111', keyObject);
    //
    // //save data
    // _.set(keyObject, 'privateKey', privateKey.toString('hex'));
    // app.data.store.set('auth', keyObject)
};