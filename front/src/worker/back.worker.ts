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
        } else if (err.message.includes('Error: intrinsic gas too low')) {
            err.message = 'gas_too_low';
        }

        response = new Response('api', request.requestId, null, null, err.message);
    }

    ipc.send(response.toJS());
});
