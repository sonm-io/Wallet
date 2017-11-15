// import router from './router/routes/index';

import { Response, Request } from './ipc/messages';
import ipc from './ipc/ipc';

// const ctx = {}; // do not use me
//
// async function processRequest(request: any, ctx: any) {
//   const fn = router.resolve(request.type);
//
//   const response = new Response(request.requestId, {success: true}, false, false);
//
//   // await fn({
//   //   ctx,
//   //   params: request.payload,
//   //   resolve: payload => response.payload = payload,
//   //   reject: error => response.error = String(error),
//   //   validation: validation => response.setValidation(validation),
//   // });
//
//   return ipc.send(response.toJS());
// }

ipc.on((request: Request) => {
    // processRequest(request, ctx);
    const response = new Response(request.requestId, {success: true}, false, false);
    ipc.send(response.toJS());
});
