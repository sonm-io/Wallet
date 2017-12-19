import { IValidation } from 'ipc/types';

export const messages: IValidation = {
    path_not_valid: 'Incorrect file path',
    password_not_valid: 'Password is not valid',
};

export function getMessageText(code: string) {
    return messages[code] || `Error ${code}`;
}

export default messages;
