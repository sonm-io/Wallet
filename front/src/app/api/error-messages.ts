import { IValidation } from 'ipc/types';

export const messages: IValidation = {
    path_not_valid: 'Incorrect file path',
    password_not_valid: 'Password is not valid',
    gas_to_low: 'Intrinsic gas too low',
};

export function getMessageText(code: string) {
    return messages[code] || `Error ${code}`;
}

export default messages;
