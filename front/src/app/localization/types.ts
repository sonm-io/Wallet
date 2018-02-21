export interface ILocalizator {
    getMessageText: TFnLocalize;
    localizeValidationMessages: TFnLocalizeValidation;
}

export type TLocalizationArgs = any[];

export interface IValidation {
    [fieldName: string]: string | [string, TLocalizationArgs];
}

export interface IMapStrToStr {
    [key: string]: string;
}

export type TLocalizationPattern = (...args: any[]) => string;

export interface ILocalizationDictionary {
    [stringCode: string]: string | TLocalizationPattern;
}

export type TFnLocalizeValidation = (validation: IValidation) => IMapStrToStr;

export type TFnLocalize = (
    code: string | [string, TLocalizationArgs],
) => string;

export interface IHasLocalizator {
    localizator: ILocalizator;
}
