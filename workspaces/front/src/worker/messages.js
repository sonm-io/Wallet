export class Response {
  constructor(requestId, payload, validation, error) {
    this.error = error === undefined ? null : error;
    this.payload = payload === undefined ? null : payload;
    this.validation =  validation === undefined ? null : validation;
    this.requestId = requestId;
  }

  isSuccess() {
    return this.error === null;
  }

  setValidation(validation) {
    this.validation = this.validation || {};
    Object.assign(this.validation, validation);
  }

  toJS() {
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
  constructor(type, requestId, payload) {
    this.type = type;
    this.requestId = requestId;
    this.payload = payload;
  }
}


