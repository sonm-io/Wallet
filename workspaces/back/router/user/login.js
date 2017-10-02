'use strict';

const keythereum = require("keythereum");
const fs = require("fs-extra");

module.exports = async function(api, data) {
    try {
        const json = await fs.readJson(data.path);

        try {
            json.privateKey = keythereum.recover(data.password, json);
            json.address = `0x${json.address}`

            api.setUser(json);

            return {
                success: true,
                data: {
                    address: json.address
                }
            };
        } catch ( err ) {
            return {
                success: false,
                validation: {
                    password: 'password_not_valid'
                },
            };
        }
    } catch ( err ) {
        return {
            success: false,
            validation: {
                path: 'path_not_valid'
            },
        };
    }

    // //save data
    // _.set(keyObject, 'privateKey', privateKey.toString('hex'));
    // app.data.store.set('auth', keyObject)
};