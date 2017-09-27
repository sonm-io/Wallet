'use strict';

const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { ipcMain } = require('electron');

const routes = require('./router/index');
const handlers = {};

for ( const namespace in routes ) {
    for (const action in routes[namespace]) {
        handlers[`${namespace}.${action}`] = routes[namespace][action];
    }
}

ipcMain.on('sonm', async (event, request) => {
    console.log(request);

    if ( request && request.type && handlers[request.type] ) {
        const result = await handlers[request.type](request.payload);

        console.log(result);

        event.sender.send(request.requestId, result);
    } else {
        event.sender.send(request.requestId, {
            error: 'endpoint_not_found',
        });
    }
});

//event.sender.send('asynchronous-reply', 'pong')

    //     async function() {
    //         return await routes[namespace][action](app)
    //     });
    //
    //
    //     if ( _.isObject(routes[namespace][action]) ) {
    //         for ( const subaction in routes[namespace][action] ) {
    //             handlers[]
    //
    //             app.on(`sonm.${namespace}.${action}.${subaction}`, async function() {
    //                 return await routes[namespace][action][subaction](app)
    //             });
    //         }
    //     } else {
    //         app.on(`sonm.${namespace}.${action}`, async function() {
    //             return await routes[namespace][action](app)
    //         });
    //     }
    // }



// for ( const namespace in routes ) {
//     for ( const action in routes[namespace] ) {
//         if ( _.isObject(routes[namespace][action]) ) {
//             for ( const subaction in routes[namespace][action] ) {
//                 app.on(`sonm.${namespace}.${action}.${subaction}`, async function() {
//                     return await routes[namespace][action][subaction](app)
//                 });
//             }
//         } else {
//             app.on(`sonm.${namespace}.${action}`, async function() {
//                 return await routes[namespace][action](app)
//             });
//         }
//     }
// }
//
// ipcMain.on('sonm', (event, payload) => {
//     console.log(event);
//     console.log(payload);
// });

const init = async () => {
    try {
        const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './config/default.yml'), 'utf8'));
        console.log(_.get(config, "connection.url"));

        //const provider = new Web3.providers.HttpProvider(_.get(config, "connection.url"));
        // const web3 = new Web3(provider);
        //
        // //const accounts =  await web3.eth.getAccounts();
        // const accounts = ['0x6Ffc014F1dEee1175Cb1c35ADD333fcBE135527f']
        //
        // //set global
        // app.data = {
        //     web3: web3,
        //     provider: provider,
        //     config: config,
        //     store: store,
        //     auth: store.get('auth'),
        // };
        //
        // //infura testing
        // app.data.auth.address = '0x6Ffc014F1dEee1175Cb1c35ADD333fcBE135527f';
        // app.data.auth.privateKey = 'e3d90c923a8b1b324b6483d1fbf640d80d9971ed982afb63c75f35fa54dc5edc';
        //
        // //check user;
        // if ( !app.data.auth ) {
        //     //very bad!
        // }
        //
        // try {
        //     //await routes.wallet.auth(app);
        //
        //     console.log('Try to get balance');
        //     const res = await routes.user.balance(app);
        //     console.log(res);
        //
        //     //await routes.wallet.transaction_history(app);
        //
        // } catch ( err ) {
        //     console.log(err.stack);
        // }
    } catch ( err ) {
        console.log(err.stack);
    }
};

init();