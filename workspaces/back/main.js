'use strict';

const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { ipcMain } = require('electron');

const routes = require('./router/index');
const handlers = {};

const api = require('../sonm-api/');

for ( const namespace in routes ) {
    for (const action in routes[namespace]) {
        handlers[`${namespace}.${action}`] = routes[namespace][action];
    }
}

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


const init = async () => {
    try {
        const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './config/default.yml'), 'utf8'));
        
        await api.init({
            user: {
                address: '0x6Ffc014F1dEee1175Cb1c35ADD333fcBE135527f',
                privateKey: 'e3d90c923a8b1b324b6483d1fbf640d80d9971ed982afb63c75f35fa54dc5edc',
            },
            connectionUrl: _.get(config, "connection.url")
        });

        ipcMain.on('sonm', async (event, request) => {
            console.log(request);

            if ( request && request.type && handlers[request.type] ) {
                const result = await handlers[request.type](api, request.payload);

                console.log(result);

                event.sender.send(request.requestId, result);
            } else {
                event.sender.send(request.requestId, {
                    error: {
                        $fatal: 'endpoint_not_found'
                    },
                })
            }
        });

        try {
            //await routes.wallet.auth(app);
            // console.log('Try to get balance');
            // let res = await routes.user.balance(api);
            // console.log(res);
            // res = await routes.user.send_token(api, {
            //     to: '0xa1fdfef08324d1865047c206735df2933daf5f7e',
            //     amount: 9,
            // });
            // console.log(res);

            //console.log(await api.sendTransaction('0xa1fdfef08324d1865047c206735df2933daf5f7e', 0.05));
            //await routes.wallet.transaction_history(app);

        } catch ( err ) {
            console.log(err.stack);
        }

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
        // app.data.auth.address = ;
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