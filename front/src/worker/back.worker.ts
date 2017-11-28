import { IPC } from '../ipc';

function delay(timeout: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, timeout));
}

const ipc = new IPC();

ipc.setRequestProcessor(async (method: string, payload: any) => {
    delay(10);

    return {
        data: 1,
    };
});
