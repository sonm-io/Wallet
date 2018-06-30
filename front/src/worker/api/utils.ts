import { Response, IResponse } from './types';

export function wrapInResponse<T>(
    fn: (...a: any[]) => T,
): (...a: any[]) => Promise<IResponse<T>> {
    return async function(...a: any[]) {
        const result = await fn(...a);

        return new Response<T>(result);
    };
}

export default wrapInResponse;
