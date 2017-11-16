import { Response } from './ipc/messages';
import * as ipc from './ipc/ipc';

ipc.on((request: any) => {
    // processRequest(request, ctx);
    const response = new Response(request.requestId, {
        pong: true,
    }, null, null);

    ipc.send(response.toJS());
});
