import { ILocalizationDictionary } from './types';

export const en: ILocalizationDictionary = {
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

    'Error: insufficient funds for gas * price + value':
        'There is not enough Ether for the transaction',
    'Error: Invalid JSON RPC response from provider':
        'Ethereum node is unavailable',
    'Error: intrinsic gas too low':
        'The transaction was rejected because of insufficient gas',
    'TypeError: Failed to fetch': 'Ethereum node is unavailable',

    required_params_missed: 'Required parameter missed',
    not_sonm_wallet_file: 'This is not SONM wallet export file',
    not_erc20_token: 'Token is not ERC20',
    not_smart_contract: 'Address is not a token contract address',
    network_error: 'Ethereum node is unavailable',
    walletFile_required: 'Select SONM wallet export file',
    should_be_ether_address: 'Please input correct address',
    should_be_positive_integer: 'Should be positive integer',
    should_be_positive_number: 'Should be positive number',
    required_value: 'Required value',
    no_addres_in_account_file: 'Incorrect file: no address field',
    incorrect_file: 'Incorrect file',
    no_blockchain_conection: 'No blockchain node connection',
    livenet: 'LIVENET',
    testnet: 'TESTNET',
    accounts: 'Accounts',
    send: 'Send',
    history: 'History',
    test_token_request: 'SONM test tokens request',
    you_need_test_ether:
        'You need test Ether for token request. Get some here - ',
    wallet_not_found: 'Wallet not found',
    tx_has_been_completed: ([
        amount,
        currencyName,
        toAddress,
        hash,
    ]: string[]) =>
        `Transaction is completed successfully. ${amount} ${currencyName} has been sent to the address ${toAddress}. TxHash ${hash}.`,
    tx_has_been_failed: ([toAddress, hash]: string[]) =>
        `Transaction to the address ${toAddress} was failed. TxHash ${hash ||
            undefined}.`,
    destination_must_be_differ:
        'The destination address must differ the sender address',
    too_many_decimal_digits: ([decimalPointOffset]: string[]) =>
        `Too many decimal digits. Maximum: ${decimalPointOffset}`,
    maximum_value_is_undetermined: 'Maximum values is undetermined',
    value_is_greater_than_max: 'Value is greater than maximum',
    create_wallet: 'CREATE WALLET',
    import_wallet: 'IMPORT WALLET',
    ethereum_network: 'Ethereum network',
    confirm_password: 'Confirm password',
    password: 'Password',
    wallet_name: 'Wallet name',
    new_wallet: 'New wallet',
    enter_password: 'Enter password',
    login: 'Login',
    should_be_hex: ([length]: any[]) =>
        `Should be hex string with length ${length}`,
    privatekey_not_valid: 'Private key not valid',
};

export default en;
