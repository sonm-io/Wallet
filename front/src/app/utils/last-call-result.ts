type TFn<I, O> = (i: I) => O;

export function lastCallResult<I, O>(orig: TFn<I, O>) {
    let lastCallResult: O;

    return async function(i: I): Promise<O> {
        lastCallResult = await orig(i);

        return lastCallResult;
    };
}

export default lastCallResult;
