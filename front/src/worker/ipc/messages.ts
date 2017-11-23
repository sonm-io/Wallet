export class Response {
    public type: string;
    public error: any;
    public data: any;
    public validation: any;
    public requestId: number;

    constructor(type: string, requestId: number, data?: any, validation?: any, error?: any) {
        this.type = type;
        this.error = error === undefined ? null : error;
        this.data = data === undefined ? null : data;
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
            type: this.type,
            success: this.isSuccess(),
            error: this.error,
            data: this.data,
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
