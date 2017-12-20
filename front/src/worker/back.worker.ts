import { Response, Request } from './ipc/messages';
import * as ipc from './ipc/ipc';
import { api } from './api';

ipc.on(async (request: Request) => {
    let response;

    try {
        const {data, validation} = await api.resolve(request);

        response = new Response('api', request.requestId, data, validation, null);
    } catch (err) {
        console.log(request);
        console.log(err);

        if (err.message.includes('Invalid JSON RPC response from provider')) {
            err.message = 'network_error';
        } else if (err.message.includes('intrinsic gas too low')) {
            err.message = 'gas_too_low';
        } else if (err.message.includes('insufficient funds for gas * price + value')) {
            err.message = 'insufficient_funds';
        }

        response = new Response('api', request.requestId, null, null, err.message.replace('Error: ', ''));
    }

    ipc.send(response.toJS());
});
