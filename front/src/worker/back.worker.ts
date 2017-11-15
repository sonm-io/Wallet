import { Response, Request } from './ipc/messages';
import * as ipc from './ipc/ipc';

ipc.on((request: Request) => {
    // processRequest(request, ctx);
    const response = new Response(request.requestId, {success: true}, false, false);
    ipc.send(response.toJS());
});
