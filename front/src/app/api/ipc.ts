import { TResultPromise } from '../../ipc/types';
import lStorage from '../utils/local-storage';

const { IPC } = require('../../ipc/index');

const ApiWorker = require('worker/back.worker.ts');
const worker = ApiWorker();

const ipc = new IPC({
    worker,
});

ipc.setRequestProcessor(async (type: string, payload: any): TResultPromise<
    any
> => {
    let result;

    if (type === 'get') {
        result = lStorage.get(payload.key);
    } else if (type === 'set') {
        result = lStorage.set(payload.key, payload.value);
    }

    return {
        data: result,
    };
});

export default ipc;
