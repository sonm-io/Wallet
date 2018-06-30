import { IResult } from '../../../ipc/types';

export function unwrapApiResult<T, A>(fn: (...a: A[]) => Promise<IResult<T>>) {
    const unwrappped = async function(...a: A[]) {
        const result = await fn(...a);

        if (result.data === undefined) {
            throw new Error('Unexpected value "undefined"');
        }

        return result.data;
    };

    return unwrappped;
}

export default unwrapApiResult;
