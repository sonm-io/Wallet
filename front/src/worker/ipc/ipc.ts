import { Request } from './messages';

const worker: Worker = self as any;

let messageHandler: (params: any) => void;

worker.addEventListener('message', (e: any) => {
    const request = new Request(e.data.type, e.data.requestId, e.data.payload);
    messageHandler(request);
});

export function on(handler: (params: any) => void) {
    messageHandler = handler;
}

export function send(response: object) {
    postMessage(response, '*');
}
