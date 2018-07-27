import { ILocalizationDictionary } from './types';

export const en: ILocalizationDictionary = {
    path_not_valid: 'Incorrect file path',
    password_not_valid: 'Password is not valid',

    sonmapi_gas_too_low:
        'The transaction was rejected because of insufficient gas',
    sonmapi_insufficient_funds: 'There is not enough Ether for the transaction',
    sonmapi_network_error: 'No blockchain node connection',

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

    required_params_missed: 'Required parameter missed',
    not_sonm_wallet_file: 'This is not SONM wallet export file',
    not_erc20_token: 'Token is not ERC20',
    not_smart_contract: 'Address is not a token contract address',

    walletFile_required: 'Select SONM wallet export file',
    should_be_ether_address: 'Please input correct address',
    should_be_positive_integer: 'Should be positive integer',
    should_be_positive_number: 'Should be positive number',
    required_value: 'Required value',
    no_addres_in_account_file: 'Incorrect file: no address field',
    incorrect_file: 'Incorrect file',
    livenet: 'LIVENET',
    testnet: 'TESTNET',
    accounts: 'Accounts',
    send: 'Send',
    history: 'History',
    test_token_request: 'SONM test tokens request',
    you_need_test_ether:
        'You need test Ether for token request. Get some here - ',
    wallet_not_found: 'Wallet not found',
    tx_sidechain_delay:
        'NORMAL TIME TO MOVE FUNDS IN/FROM THE OPPOSITE BLOCKCHAIN IS: [b]THE TIME OF MINING YOUR TRANSACTION + 15 MINUTES[/b]',
    tx_has_been_completed: ([
        amount,
        currencyName,
        toAddress,
        hash,
    ]: string[]) =>
        `Transaction is completed successfully. ${amount} ${currencyName} has been sent to the address ${toAddress}. TxHash ${hash}.`,
    tx_has_been_failed: ([toAddress, hash]: string[]) =>
        `Transaction to the address ${toAddress} was failed. ${
            hash !== '' ? 'TxHash ' + hash + '.' : ''
        }`,
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

    'status-anon': 'ANONYMOUS',
    'status-reg': 'REGISTERED',
    'status-ident': 'IDENTIFIED',

    create_change_request_success: ([id, hash]: string[]) =>
        `Change request for deal #${id} created. TxHash ${hash}.`,

    cancel_change_request_success: ([id, hash]: string[]) =>
        `Change request for deal #${id} is canceled. TxHash ${hash}.`,

    tx_buy_order_failed: ([id, hash]: string[]) =>
        `Buy order #${id} is failed. TxHash ${hash}.`,

    tx_buy_order_matching: ([id, hash]: string[]) =>
        `Order #${id} is matching. TxHash ${hash}.`,

    tx_buy_order_matched: ([id, dealId]: string[]) =>
        `Order #${id} is matched. Deal #${dealId}.`,

    tx_buy_order_match_failed: ([id]: string[]) => `Order #${id} match failed`,

    deal_finish_failed: ([id, hash]: string[]) =>
        `Finish deal #${id} is failed. TxHash ${hash}.`,

    deal_finish_success: ([id, hash]: string[]) =>
        `Deal #${id} is finished. TxHash ${hash}.`,
};

export default en;
