import ipc from './ipc';
import { api } from './api';
import { TResultPromise, IValidation } from '../ipc/types';
import { instanceOf } from 'prop-types';

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

        throw Error(
            (err instanceof Error ? err.message : String(err)).replace(
                /^Error: /,
                '',
            ),
        );
    }
});
