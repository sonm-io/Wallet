export type TPrice = string;

export type TEthereumAddress = string;

export type TEthereumHash = string;

export type TPrimitive =
    | TPrice
    | TEthereumAddress
    | number
    | string
    | Date
    | TEthereumHash;

export interface IDictionary {
    [index: string]: TPrimitive;
}
