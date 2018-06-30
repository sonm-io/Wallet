import { TResultPromise } from '../../ipc/types';

const { IPC } = require('../../ipc/index');

const ApiWorker = require('worker/back.worker.ts');
const worker = new ApiWorker();

export const ipc = new IPC({
    worker,
});

ipc.setRequestProcessor(async (type: string, payload: any): TResultPromise<
    string
> => {
    let data = '';

    switch (type) {
        case 'get':
            data = window.localStorage.getItem(payload.key) || '';
            break;
        case 'set':
            window.localStorage.setItem(payload.key, (data = payload.value));
            break;
    }

    return {
        data,
    };
});

export default ipc;
