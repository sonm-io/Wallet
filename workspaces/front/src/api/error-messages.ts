export interface IValidation {
  [key: string]: string;
}

const messages: IValidation = {
  path_not_valid: 'Incorrect file path',
  password_not_valid: 'Password is not valid',
}

export { messages };
