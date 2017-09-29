'use strict';

const keythereum = require("keythereum");
const fs = require("fs-extra");

module.exports = async function(api, data) {
    try {
        const json = await fs.readJson(data.path);

        try {
            keythereum.recover(data.password, json);

            return {
                data: {
                    address: json.address
                }
            };
        } catch ( err ) {
            return {
                validation: {
                    password: 'password_not_valid'
                },
            };
        }
    } catch ( err ) {
        return {
            validation: {
              path: 'path_not_valid'
            },
        };
    }

    // //save data
    // _.set(keyObject, 'privateKey', privateKey.toString('hex'));
    // app.data.store.set('auth', keyObject)
};