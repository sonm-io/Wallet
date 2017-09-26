'use strict';

const keythereum = require("keythereum");
const fs = require("fs-extra");

module.exports = async function(data) {

    //data.path = '/Users/dmitrypisanko/Library/Ethereum/rinkeby/keystore/UTC--2017-09-15T07-23-42.468863488Z--23ea8516453f743b729a57b53369a6b50d98ae2c';
    //console.log(data.path);

    try {
        const json = await fs.readJson(data.path);

        try {
            const privateKey = keythereum.recover(data.password, json);

            return {
                succcess: true
            };
        } catch ( err ) {
            return {
                error: {
                    password: 'password_not_valid'
                },
            };
        }
    } catch ( err ) {
        return {
          error: {
              path: 'path_not_valid'
          },
        };
    }

    // //save data
    // _.set(keyObject, 'privateKey', privateKey.toString('hex'));
    // app.data.store.set('auth', keyObject)
};