import * as t from 'tcomb';

export type TValidator<T> = { [P in keyof T]: any };

export function createStruct<T>(
    scheme: TValidator<T>,
    name: string,
): t.Struct<T> {
    return t.struct(scheme);
}
