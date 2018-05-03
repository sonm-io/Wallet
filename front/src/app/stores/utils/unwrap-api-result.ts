export function unwrapApiResult<T>(fn: any) {
    return async function(...a: any[]) {
        const result = await fn(...a);

        return result.data as T;
    };
}

export default unwrapApiResult;
