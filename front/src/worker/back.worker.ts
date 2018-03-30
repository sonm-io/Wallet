import ipc from './ipc';
import { api } from './api';
import { TResultPromise, IValidation } from '../ipc/types';

ipc.setRequestProcessor(async (type: string, payload: any): TResultPromise<
    any
> => {
    try {
        const { data, validation } = await api.resolve(type, payload);

        return {
            data,
            validation: validation as IValidation,
        };
    } catch (err) {
        if (IS_DEV) {
            console.error(type, payload);
            console.error(err);
        }

        if (err.message.includes('Invalid JSON RPC response from provider')) {
            err.message = 'network_error';
        } else if (err.message.includes('intrinsic gas too low')) {
            err.message = 'gas_too_low';
        } else if (
            err.message.includes('insufficient funds for gas * price + value')
        ) {
            err.message = 'insufficient_funds';
        }

        // return {
        //     error: err.message.replace('Error: ', ''),
        // };

        throw Error(err.message.replace('Error: ', ''));
    }
});
