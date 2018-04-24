export interface ILocalizedPureComponent<TUiTextSet> {
    getUiText: TFnGetUiText<TUiTextSet>;
}

export type TFnGetUiText<TUiTextSet> = (text: TUiTextSet, args?: any) => string;
