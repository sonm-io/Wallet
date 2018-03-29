import * as t from './types';

export * from './types';

export interface InterfaceIPC {
    send<TParams, TResult>(
        method: string,
        payload: TParams,
    ): t.TResultPromise<TResult>;
    setRequestProcessor(processRequest: t.TRequestProcessor<any, any>): void;
}

export interface IIpcCtrArguments {
    worker?: any;
    errorMessageMap?: t.IValidation;
}

const noop = (x: any) => undefined;

export class IPC implements InterfaceIPC {
    private worker: t.IWebWorker;
    private requestIdToListener: Map<string, t.TListener<any>>;
    private requestIdCount = 0;
    private processRequest?: t.TRequestProcessor<any, any>;
    private sign = IPC.generateSign();
    private errorMessageMap: t.IValidation;

    constructor(params: IIpcCtrArguments = {}) {
        const { worker = self, errorMessageMap = {} } = params;

        // if (!(worker instanceof Worker)) {
        //     throw new Error('worker is not IWebWorker implementation');
        // }

        this.worker = worker;
        this.worker.addEventListener('message', this.onMessage);
        this.errorMessageMap = errorMessageMap;
        this.requestIdToListener = new Map<string, t.TListener<any>>();
    }

    private static generateSign(): string {
        return (
            `${Date.now().toString(36)}-` +
            `${Math.random()
                .toString(36)
                .slice(2)}-${Math.random()
                .toString(36)
                .slice(2)}`
        );
    }

    private getListeners(requestId: string): t.TListener<any> {
        return this.requestIdToListener.get(requestId) || noop;
    }

    private onMessage: t.TMessageHandler = async (event: MessageEvent) => {
        const processRequest = this.processRequest;

        if (event.data.sign === this.sign && event.data.requestId) {
            const message = event.data;
            const requestId = message.requestId;

            this.getListeners(requestId)(message);
        } else if (
            processRequest !== undefined &&
            event.data &&
            event.data.method &&
            event.data.sign &&
            event.data.requestId
        ) {
            const sign = event.data.sign as string;
            const requestId = event.data.requestId as string;

            const sendResponse = async (
                result?: t.IResult<any>,
                error?: Error,
            ) => {
                const success = result !== undefined;

                const response: t.IResponse<any> = {
                    done: true, // see continuation
                    data: undefined,
                    requestId,
                    sign,
                    success,
                };

                if (result !== undefined) {
                    const { data, validation /*, continuation*/ } = result;

                    // if (continuation) {
                    //     response.done = false;
                    //     continuation
                    //         .then(r => processResponse(r, undefined))
                    //         .catch(e => processResponse(undefined, e));
                    // }

                    response.data = data;
                    (response as t.IFormResponse<any>).validation = validation;
                } else {
                    response.success = false;
                    response.error = String(event);
                }

                this.worker.postMessage(response);
            };

            processRequest(event.data.method, event.data.payload)
                .then(r => sendResponse(r, undefined))
                .catch(e => sendResponse(undefined, e));
        }
    };

    private getNextRequestId(): string {
        return 'request' + this.requestIdCount++;
    }

    private processValidation(input: t.IValidation): t.IValidation {
        return Object.keys(input).reduce((acc: t.IValidation, key: string) => {
            const phrase = input[key];

            acc[key] =
                phrase in this.errorMessageMap
                    ? this.errorMessageMap[phrase]
                    : phrase;

            return acc;
        }, {});
    }

    public send<TParams, TResult>(
        method: string,
        payload: TParams,
    ): t.TResultPromise<any> {
        return new Promise((done, reject) => {
            const requestId = this.getNextRequestId();

            const callback: t.TListener<TResult> = (
                response: t.IResponse<TResult>,
            ) => {
                const formResponse = response as t.IFormResponse<TResult>;

                if (formResponse.validation !== undefined) {
                    formResponse.validation = this.processValidation(
                        formResponse.validation,
                    );
                }

                if (response.done) {
                    this.requestIdToListener.delete(requestId);
                }

                if (response.success) {
                    done({
                        data: response.data,
                        validation: response.validation,
                    });
                } else {
                    /* tslint:disable */
                    console.error(`method ${method} error: ${response.error}`);
                    /* tslint:enable */

                    reject(response.error || 'request failed');
                }
            };

            this.requestIdToListener.set(requestId, callback as any);

            const request: t.IRequest<TParams> = {
                requestId,
                method,
                payload,
                sign: this.sign,
            };

            this.worker.postMessage(request);
        });
    }

    public setRequestProcessor(
        processRequest: t.TRequestProcessor<any, any>,
    ): void {
        if (typeof processRequest === 'function') {
            this.processRequest = processRequest;
        }
    }
}

export default IPC;
