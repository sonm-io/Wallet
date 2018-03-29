import IPC from '../ipc';

const ipc = new IPC({
    worker: self,
});

export default ipc;
