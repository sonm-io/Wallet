import { lands } from './lands-data';
import { ILand, ILandMap } from './lands-types';

const cache: any = {};

export const getMap = (keyField: string = 'abCode2'): ILandMap => {
    if (cache.hasOwnProperty(keyField)) {
        return cache[keyField];
    }

    const idx = lands.scheme.indexOf(keyField);

    if (idx === -1) {
        throw new Error('Unknown field name: ' + keyField);
    }

    const result = lands.data.reduce<ILandMap>((acc: ILandMap, rawRec: any) => {
        const upperCaseKey = String(rawRec[idx]).toUpperCase();
        const rec = getRecord(lands.scheme, rawRec);
        const upperCaseCode2 = rec.abCode2.toUpperCase();

        rec.domain =
            lands.doesNotHaveDomain.indexOf(upperCaseCode2) === -1
                ? '.' +
                  (
                      (lands.abCode2ToDomainMap as any)[upperCaseCode2] ||
                      rec.abCode2
                  ).toLowerCase()
                : undefined;

        acc[upperCaseKey] = rec;
        return acc;
    }, {});

    cache[keyField] = result;

    return result;
};

export const getRecord = (scheme: string[], rawRec: any[]): ILand => {
    return scheme.reduce<any>((acc, key, idx) => {
        acc[key] = rawRec[idx] || undefined;
        return acc;
    }, {});
};

export * from './lands-types';

export * from './lands-data';
