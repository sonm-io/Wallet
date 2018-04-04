import { countries } from './iso-country-codes';

export const getFullMap = (keyField: string = 'a2') => {
    const idx = countries.scheme.indexOf(keyField);

    if (idx === -1) {
        throw new Error('Unknown field name: ' + keyField);
    }

    return countries.data.reduce(
        (acc, rawRec) => {
            const key = rawRec[idx];
            const rec = getRecord(countries.scheme, rawRec);

            if (rec.a2 === 'GB') {
                rec.domain = '.uk';
            } else {
                rec.domain = '.' + rec.a2.toLowerCase();
            }

            acc[String(key).toLowerCase()] = rec;
            return acc;
        },
        {} as any,
    );
};

export const getRecord = (scheme: string[], rawRec: any[]) => {
    return scheme.reduce(
        (acc, key, idx) => {
            acc[key] = rawRec[idx];
            return acc;
        },
        {} as any,
    );
};
