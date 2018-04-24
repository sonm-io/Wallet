import { IResult } from 'app/api/types';

type TFnFromApi<T> = (...a: any[]) => Promise<IResult<T>>;
type TFnGetData<T> = (...a: any[]) => Promise<T>;
export function dataFromApiResult<T>(apiFn: TFnFromApi<T>): TFnGetData<T> {
    return async (...a: any[]): Promise<T> => {
        const result = await apiFn(...a);

        return result.data as T;
    };
}

export default dataFromApiResult;
