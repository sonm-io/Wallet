import { IValidation } from 'ipc/types';

export const messages: IValidation = {
    path_not_valid: 'Incorrect file path',
    password_not_valid: 'Password is not valid',
    gas_too_low: 'The transaction was rejected because of insufficient gas',
    password_not_match: 'Password does not match',
    wallet_allready_exists: 'Already exist',
    password_required: 'Password is required',
    walletName_required: 'Wallet name is required',
    wallet_name_length: 'Name length must be in range 1..20',
    name_required: 'Name is required',
    password_length: 'Password must be at least 8 character',
    account_already_exists: 'Account already exists',
    select_file: 'Please select file',
    wait_your_tokens: 'SNMT has been successfully delivered from Mars',
    give_me_more: 'Give me SONM tokens!',
    insufficient_funds: 'There is not enough Ether for the transaction',
    required_params_missed: 'Required parameter missed',
    not_sonm_wallet_file: 'This is not SONM wallet export file',
    not_erc20_token: 'Token is not ERC20',
    not_smart_contract: 'Address is not a token contract address',
};

export function getMessageText(code: string) {
    return messages[code] || code;
}

export default messages;
