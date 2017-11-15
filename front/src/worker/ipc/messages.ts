export class Response {
    public error: any;
    public payload: any;
    public validation: any;
    public requestId: number;

    constructor(requestId: number, payload?: any, validation?: any, error?: any) {
        this.error = error === undefined ? null : error;
        this.payload = payload === undefined ? null : payload;
        this.validation = validation === undefined ? null : validation;
        this.requestId = requestId;
    }

    public isSuccess() {
        return this.error === null;
    }

    public setValidation(validation: any) {
        this.validation = this.validation || {};
        Object.assign(this.validation, validation);
    }

    public toJS() {
        return {
            success: this.isSuccess(),
            error: this.error,
            payload: this.payload,
            validation: this.validation,
            requestId: this.requestId,
        };
    }
}

export class Request {
    public type: string;
    public requestId: number;
    public payload: object;

    constructor(type: string, requestId: number, payload: object) {
        this.type = type;
        this.requestId = requestId;
        this.payload = payload;
    }
}
