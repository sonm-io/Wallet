import { Request } from "./messages";

let messageHandler = null;

// ==
onmessage = function(e) {
  const request = new Request(e.data.type, e.data.requestId, e.data.payload);

  messageHandler(request);
};
// ==

export function on(handler) {
  messageHandler = handler;
}

export function send(response) {
  postMessage(response);
}