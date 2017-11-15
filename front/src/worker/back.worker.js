import router from './router/routes/index';
import { Response } from './ipc/messages';
import * as ipc from './ipc/ipc';

const ctx = {}; // do not use me

async function processRequest(request, ctx) {
  const fn = router.resolve(request.type);

  const response = new Response(request.requestId);

  await fn({
    ctx,
    params: request.payload,
    resolve: payload => response.payload = payload,
    reject: error => response.error = String(error),
    validation: validation => response.setValidation(validation),
  });

  return ipc.send(response.toJS());
}

ipc.on(request => {
  processRequest(request, ctx);
});
