import IPC from '../ipc';

const worker: Worker = self as any;

const ipc = new IPC({
    worker,
});

export default ipc;
