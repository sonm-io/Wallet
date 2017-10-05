'use strict';

const grpc = require('grpc');

const sonmGRPC = grpc.load(__dirname + '/../../proto/marketplace.proto').sonm;
const market = new sonmGRPC.Market('localhost:50051', grpc.credentials.createInsecure());

module.exports = async function(app) {
    const res = await market.GetOrderByID({id: '123'});
    console.log(res);

    console.log('111');
};