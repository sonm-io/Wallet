'use strict';

const keythereum = require("keythereum");
const fs = require("fs-extra");

module.exports = async function(params) {
  const api = params.api;
  const data = params.data;

  try {
        const json = fs.readJsonSync(data.path);

        try {
            json.privateKey = keythereum.recover(data.password, json);
            json.address = `0x${json.address}`;

            api.setUser(json);

            return {
                data: {
                    address: json.address,
                },
            };
        } catch ( err ) {
          console.log(err.stack);

            return {
                validation: {
                    password: 'password_not_valid',
                },
            };
        }
    } catch ( err ) {
        console.log(err.stack);

        return {
            validation: {
                path: 'path_not_valid',
            },
        };
    }

    // //save data
    // _.set(keyObject, 'privateKey', privateKey.toString('hex'));
    // app.data.store.set('auth', keyObject)
};