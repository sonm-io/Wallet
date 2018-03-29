export interface IValidation {
    [key: string]: string;
}

export interface IRequest<T> {
    method: string;
    requestId: string;
    payload: T;
    sign: string;
}

export interface IResponse<T> {
    requestId?: string;
    success: boolean;
    data: T;
    error?: string;
    validation?: IValidation;
    sign: string;
    done: boolean;
}

export interface IFormResponse<T> extends IResponse<T> {
    validation?: any;
}

export type TMessageEventName = 'message';

export type TMessageHandler = (event: MessageEvent) => void;

export type TListener<T> = (response: IResponse<T>) => void;

export type TResultPromise<T> = Promise<IResult<T>>;

export interface IResult<T> {
    data?: T;
    error?: any;
    validation?: IValidation;
    continuation?: TResultPromise<T>;
}

export type TRequestProcessor<TPayload, TResult> = (
    type: string,
    payload: TPayload,
) => TResultPromise<TResult>;

export interface IWorker {
    addEventListener: (
        name: TMessageEventName,
        callback: TMessageHandler,
    ) => void;
    postMessage: (
        message: IRequest<any> | IResponse<any>,
        transfer?: any[],
    ) => void;
    processRequest?: TRequestProcessor<string, any>;
}

export interface IWindowWorker {
    addEventListener: (
        name: TMessageEventName,
        callback: TMessageHandler,
    ) => void;
    postMessage: (
        message: IRequest<any> | IResponse<any>,
        targetOrigin: string,
        transfer?: any[],
    ) => void;
    processRequest?: TRequestProcessor<string, any>;
}
