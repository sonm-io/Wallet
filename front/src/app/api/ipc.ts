import { messages } from './error-messages';
import {
    IPC,
} from '../../ipc';

// ** webpack magic
const createWorker = require('worker/back.worker.ts');
const worker = createWorker();
// **

export const ipc = new IPC({
    worker,
    errorMessageMap: messages,
});

export default ipc;
