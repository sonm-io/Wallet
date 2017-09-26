'use strict';

const Web3 = require('web3');
const path = require('path');
const url = require('url');
const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { app } = require('electron');

const routes = require('./router/index');

for ( const namespace in routes ) {
    for ( const action in routes[namespace] ) {
        if ( _.isObject(routes[namespace][action]) ) {
            for ( const subaction in routes[namespace][action] ) {
                app.on(`sonm.${namespace}.${action}.${subaction}`, async function() {
                    return await routes[namespace][action][subaction](app)
                });
            }
        } else {
            app.on(`sonm.${namespace}.${action}`, async function() {
                return await routes[namespace][action](app)
            });
        }
    }
}

const init = async () => {
    try {
        const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './config/default.yml'), 'utf8'));
        const provider = new Web3.providers.HttpProvider(_.get(config, "connection.host"));
        const web3 = new Web3(provider);
        const accounts =  await web3.eth.getAccounts();

        app.data = {
            web3: web3,
            provider: provider,
            account: accounts[0],
            config: config,
        };

        try {
            console.log('Try to get balance');
            const res = await routes.wallet.balance(app);
            console.log(res);
        } catch ( err ) {
            console.log(err.stack);
        }
    } catch ( err ) {
        console.log(err.stack);
    }
};

init();