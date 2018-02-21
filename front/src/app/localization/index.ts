import {
    ILocalizationDictionary,
    TFnLocalize,
    IValidation,
    TLocalizationArgs,
    ILocalizator,
    IMapStrToStr,
} from './types';

export {
    ILocalizator,
    ILocalizationDictionary,
    TFnLocalize,
    IValidation,
    TLocalizationArgs,
    TFnLocalizeValidation,
    IHasLocalizator,
} from './types';

import { en } from './en';

export function getMessageTextFrom(
    dictionary: ILocalizationDictionary,
    code: string | [string, TLocalizationArgs],
) {
    let result: string;
    let args: any[] = [];

    if (Array.isArray(code)) {
        [code, ...args] = code;
    }

    const pattern = dictionary[code] || code;

    if (typeof pattern === 'function') {
        result = pattern(code, args);
    } else {
        result = pattern;
    }

    return result;
}

export function localizeValidationMessages(
    getTextMessage: TFnLocalize,
    validation: IValidation,
): IMapStrToStr {
    const result: IMapStrToStr = {};

    Object.keys(validation).reduce((acc: IValidation, fieldName: string) => {
        acc[fieldName] = getTextMessage(validation[fieldName]);

        return acc;
    }, result);

    return result;
}

export function createLocalizator(dict: ILocalizationDictionary): ILocalizator {
    const getMessageText = getMessageTextFrom.bind(null, dict);

    return {
        getMessageText,
        localizeValidationMessages: (validation: IValidation) =>
            localizeValidationMessages(getMessageText, validation),
    };
}

export const localizator = createLocalizator(en);
