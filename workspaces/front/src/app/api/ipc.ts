let worker: Worker;

type messageHandler = (...args: any[]) => void;

const allListeners = new Map<string, Set<messageHandler>>();

export function createProcess(pathToJS: string) {
  worker = new Worker(pathToJS);

  worker.onmessage = onMessage;
}

export async function on(requestId: string, handler: messageHandler) {
  const listeners = getListeners(requestId);

  listeners.add(handler);
}

export async function once(requestId: string, handler: messageHandler) {
  const listeners = getListeners(requestId);

  const onceHandler = (...args: any[]) => {
    handler(...args);
    listeners.delete(onceHandler);
  };

  listeners.add(handler);
}

export function send(message: any) {
  worker.postMessage(message);
}

function getListeners(requestId: string) {
  let listeners = allListeners.get(requestId);

  if (!listeners) {
    listeners = new Set();
    allListeners.set(requestId, listeners);
  }

  return listeners;
}

function onMessage(e: MessageEvent) {
  const message = e.data;
  const requestId = message.requestId as string;

  const listeners = getListeners(requestId);
  listeners.forEach(handler => {
    handler(requestId);
  });
}