'use strict';

const path = require('path');
const { ipcMain, ipcRenderer } = require('electron');
const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const grpc = require('grpc');
const grpc_promise = require('grpc-promise');

const routes = require('./router/index');
const handlers = {};

const api = require('../sonm-api/');

for ( const namespace in routes ) {
    for (const action in routes[namespace]) {
        handlers[`${namespace}.${action}`] = routes[namespace][action];
    }
}

// https://github.com/ethjs/ethjs-provider-signer
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

        //init sonm API
        await api.init({
            connectionUrl: _.get(config, "connection.rpcUrl"),
        });

        //init GRPC
        const sonmGRPC = grpc.load(__dirname + '/proto/marketplace.proto').sonm;
        const market = new sonmGRPC.Market(_.get(config, "connection.grpcUrl"), grpc.credentials.createInsecure());
        grpc_promise.promisifyAll(market);

        ipcMain.on('sonm', async (event, request) => {
            console.log('REQUEST', request);

            if ( request && request.type && handlers[request.type] ) {
                // event.sender.send(request.requestId, {
                //   done: false,
                //   success: true,
                // });

                handlers[request.type]({
                  api: api,
                  market: market,
                  data: request.payload,
                }).then( result => {
                  console.log(result);

                  if ( result ) {
                    result.success = true;
                    result.done = true;

                    console.log('RESPONSE', result);

                    event.sender.send(request.requestId, result);
                  }
                }).catch( _ => {
                  event.sender.send(request.requestId, {
                    done: true,
                    success: false,
                    error: {
                      $fatal: 'something_wrong',
                    },
                  });
                });
            } else {
                event.sender.send(request.requestId, {
                  success: false,
                  error: {
                    $fatal: 'endpoint_not_found',
                  },
                });
            }
        });

        try {
            await routes.market.list({
              market: market,
            });

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
    } catch ( err ) {
        console.log(err.stack);
    }
};

init();