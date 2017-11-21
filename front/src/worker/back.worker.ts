import { Response, Request } from './ipc/messages';
import * as ipc from './ipc/ipc';
import { api } from './api';

ipc.on(async (request: Request) => {
    let response;

    try {
        const {data, validation} = await api.resolve(request);
        response = new Response(request.requestId, data, validation, null);
    } catch (err) {
        response = new Response(request.requestId, null, null, err.message);
    }

    ipc.send(response.toJS());
});
