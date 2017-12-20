import { IValidation } from 'ipc/types';

export const messages: IValidation = {
    path_not_valid: 'Incorrect file path',
    password_not_valid: 'Password is not valid',
    gas_too_low: 'The transaction was rejected because of insufficient gas',
    password_not_match: 'Password does not match',
};

export function getMessageText(code: string) {
    return messages[code] || `Error ${code}`;
}

export default messages;
