import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { ISendTransactionResult, TransactionStatus } from 'app/api';
import { ICurrencyItemProps } from 'app/components/common/currency-big-select';
import {
    ISendFormValues,
    TGasPricePriority,
    IPasswordCache,
    AlertType,
    IApiSend,
} from './types';
import { OnlineStore, IOnlineStoreServices } from './online-store';
const { pending, catchErrors } = OnlineStore;
import { RootStore } from './';
import {
    validateEtherAddress,
    validatePositiveNumber,
    validatePositiveInteger,
    validateNumberPositiveNumberWithMin,
} from 'app/utils/validation/';
import {
    createBigNumber,
    createBigNumberAlways,
    createBigNumberFromFloat,
    ZERO,
} from 'app/utils/create-big-number';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';
import { IValidation } from 'app/localization';
import { IAccountInfo } from 'app/api/types/account';

const emptyForm: ISendFormValues = {
    fromAddress: '',
    toAddress: '',
    currencyAddress: '',
    amountEther: '',
    gasLimit: '',
    gasPriceGwei: '',
    password: '',
};
Object.freeze(emptyForm);
// const allFormKeys = Object.keys(emptyForm) as Array<keyof ISendFormValues>;

export class SendStore extends OnlineStore {
    public static readonly GAS_LIMIT_SEND_LIVENET = '70000';
    public static readonly GAS_LIMIT_SEND_TESTNET = '1000000';

    protected rootStore: RootStore;
    protected api: IApiSend;
    protected disableToAddressValidation: boolean;
    protected initialGasLimit: string;

    constructor(
        rootStore: RootStore,
        services: IOnlineStoreServices,
        api: IApiSend,
        disableToAddressValidation: boolean = false,
        initialGasLimit: string = SendStore.GAS_LIMIT_SEND_LIVENET,
    ) {
        super(services);
        this.rootStore = rootStore;
        this.disableToAddressValidation = disableToAddressValidation;
        this.api = api;
        this.initialGasLimit = initialGasLimit;
    }

    protected get localizator() {
        return this.services.localizator;
    }

    @computed
    get defaultGasLimit() {
        return this.rootStore.wallet.isLivenet
            ? this.initialGasLimit
            : SendStore.GAS_LIMIT_SEND_TESTNET;
    }

    @observable public userInput: ISendFormValues = { ...emptyForm };

    @observable protected userInputTouched: Array<keyof ISendFormValues> = [];

    @observable protected serverValidation: ISendFormValues = { ...emptyForm };

    protected isFieldTouched(fieldName: keyof ISendFormValues) {
        return this.userInputTouched.indexOf(fieldName) !== -1;
    }

    /**
     * form validation
     */

    @computed
    public get isFormValid() {
        return (
            (this.disableToAddressValidation ||
                this.validationToAddress.length === 0) &&
            this.validationGasPrice.length === 0 &&
            this.validationAmount.length === 0 &&
            this.validationGasLimit.length === 0
        );
    }

    @computed
    public get hasNecessaryValues() {
        return (
            this.userInput.amountEther !== '' &&
            (this.disableToAddressValidation || this.userInput.toAddress !== '')
        );
    }

    @computed
    public get validationToAddress() {
        const result: string[] = [];
        const toAddress = this.userInput.toAddress;

        if (
            !this.disableToAddressValidation &&
            this.isFieldTouched('toAddress')
        ) {
            if (toAddress === '') {
                result.push('Required field');
            } else if (toAddress === this.fromAddress) {
                result.push(
                    this.localizator.getMessageText(
                        'destination_must_be_differ',
                    ),
                );
            } else {
                result.push(
                    ...validateEtherAddress(toAddress).map(
                        this.localizator.getMessageText,
                    ),
                );
            }
        }

        return result;
    }

    @computed
    public get validationGasPrice() {
        const result: string[] = [];
        const gasPrice = this.gasPriceGwei;

        if (this.isFieldTouched('gasPriceGwei')) {
            if (gasPrice === '') {
                result.push(this.localizator.getMessageText('required_value'));
            } else {
                result.push(
                    ...validateNumberPositiveNumberWithMin(
                        gasPrice,
                        '0.0000001',
                    ).map(this.localizator.getMessageText),
                );
            }
        }

        return result;
    }

    @computed
    public get validationAmount() {
        const result: string[] = [];
        const amount = this.userInput.amountEther;

        if (this.isFieldTouched('amountEther')) {
            if (amount === '') {
                result.push(this.localizator.getMessageText('required_value'));
            } else {
                result.push(
                    ...validatePositiveNumber(amount).map(
                        this.localizator.getMessageText,
                    ),
                );

                const decimalPointOffset = this.currentCurrency
                    ? Number(this.currentCurrency.decimalPointOffset)
                    : 0;

                if (result.length === 0) {
                    const decimalDigits = amount.split('.')[1];

                    if (
                        decimalDigits &&
                        decimalDigits.length > decimalPointOffset
                    ) {
                        result.push(
                            this.localizator.getMessageText([
                                'too_many_decimal_digits',
                                [decimalPointOffset],
                            ]),
                        );
                    }
                }

                if (result.length === 0) {
                    const currentMax = createBigNumber(
                        this.currentBalanceMaximumWei,
                    );

                    if (currentMax === undefined) {
                        result.push(
                            this.localizator.getMessageText(
                                'maximum_value_is_undetermined',
                            ),
                        );
                    } else if (
                        currentMax.lt(
                            createBigNumberFromFloat(
                                amount,
                                decimalPointOffset,
                            ),
                        )
                    ) {
                        result.push(
                            this.localizator.getMessageText(
                                'value_is_greater_than_max',
                            ),
                        );
                    }
                }
            }
        }

        return result;
    }

    @computed
    public get currentCurrency() {
        return this.rootStore.currency.getItem(this.currencyAddress);
    }

    @computed
    public get validationGasLimit() {
        return this.userInput.gasLimit === ''
            ? []
            : validatePositiveInteger(this.userInput.gasLimit).map(
                  this.localizator.getMessageText,
              );
    }

    /**
     * form values
     */

    @computed
    public get amount() {
        if (this.validationAmount.length === 0) {
            return this.userInput.amountEther;
        }

        return '';
    }

    @computed
    public get toAddress() {
        return this.userInput.toAddress;
    }

    @computed
    public get fromAddress() {
        return (
            this.userInput.fromAddress ||
            this.rootStore.myProfiles.accountAddressList[0] ||
            ''
        );
    }

    @computed
    public get currencyAddress() {
        return (
            this.userInput.currencyAddress ||
            this.rootStore.currency.etherAddress
        );
    }

    @computed
    public get gasLimit() {
        return this.userInput.gasLimit || this.defaultGasLimit;
    }

    @computed
    public get priority(): TGasPricePriority {
        let result: TGasPricePriority = 'normal';

        if (this.userInput.gasPriceGwei !== '') {
            const [min, max] = this.rootStore.gasPrice.gasPriceThresholds;
            const userInput = createBigNumber(
                // gwei -> wei
                moveDecimalPoint(this.userInput.gasPriceGwei, 9),
            );
            if (userInput) {
                if (userInput.lte(createBigNumberAlways(min))) {
                    result = 'low';
                } else if (userInput.gte(createBigNumberAlways(max))) {
                    result = 'high';
                }
            }
        }

        return result;
    }

    @computed
    get gasPriceGwei() {
        return this.userInput.gasPriceGwei
            ? this.userInput.gasPriceGwei
            : moveDecimalPoint(this.rootStore.gasPrice.averageGasPrice, -9);
    }

    @computed
    get currentBalanceMaximum(): string {
        const amountWei = this.currentBalanceMaximumWei;
        let result = '';

        const currencyInfo = this.rootStore.currency.getItem(
            this.currencyAddress,
        );

        if (currencyInfo !== undefined && amountWei !== undefined) {
            result = moveDecimalPoint(
                amountWei,
                -currencyInfo.decimalPointOffset,
                4,
            );
        }

        return result;
    }

    @computed
    get currentBalanceMaximumWei() {
        const account = this.rootStore.myProfiles.getItem(
            this.fromAddress,
        ) as IAccountInfo;

        let amountWei = createBigNumber(
            account.currencyBalanceMap[this.currencyAddress],
        );

        if (amountWei) {
            if (this.rootStore.currency.etherAddress === this.currencyAddress) {
                const gasPriceWei = createBigNumberFromFloat(
                    this.gasPriceGwei,
                    9,
                );
                const gasLimit = createBigNumber(this.gasLimit);

                if (gasLimit && gasPriceWei) {
                    const feeWei = gasPriceWei.mul(gasLimit);

                    amountWei = amountWei.sub(feeWei);

                    if (amountWei.lt(ZERO)) {
                        amountWei = undefined;
                    }
                }
            }
        }

        return String(amountWei);
    }

    /**
     *
     */

    @computed
    public get currentBalanceList(): ICurrencyItemProps[] {
        if (this.fromAddress === '') {
            return [];
        }

        return this.rootStore.myProfiles.getBalanceListFor(this.fromAddress);
    }

    @action.bound
    public setUserInput(values: Partial<ISendFormValues>) {
        const keys = Object.keys(values) as Array<keyof ISendFormValues>;

        keys.forEach(key => {
            if (values[key] !== undefined) {
                this.userInput[key] = String(values[key]);

                if (this.userInputTouched.indexOf(key) === -1) {
                    this.userInputTouched.push(key);
                }
            }
        });
    }

    @action.bound
    protected setServerValidation(validation: Partial<ISendFormValues>) {
        this.serverValidation = {
            ...emptyForm,
            ...this.localizator.localizeValidationMessages(
                validation as IValidation,
            ),
        };
    }

    @action.bound
    public resetServerValidation() {
        this.serverValidation = { ...emptyForm };
    }

    @action.bound
    public resetUserInput() {
        this.resetServerValidation();
        this.userInputTouched = [];
        this.userInput = {
            ...emptyForm,
            gasPriceGwei: this.userInput.gasPriceGwei,
            gasLimit: this.userInput.gasLimit,
        };
    }

    protected passwordCache: IPasswordCache = {};

    @pending
    @asyncAction
    public *checkSelectedAccountPassword(password: string) {
        const accountAddress = this.fromAddress;

        let validationMessage = '';

        if (
            accountAddress in this.passwordCache &&
            this.passwordCache[accountAddress] === password
        ) {
            validationMessage = '';
        } else {
            const {
                data: privateKey,
                validation,
            } = yield this.api.getPrivateKey(password, accountAddress);

            if (privateKey) {
                this.passwordCache[accountAddress] = password;
                validationMessage = '';
            } else if (validation && validation.password) {
                validationMessage = validation.password;
            }
        }

        this.serverValidation.password = this.localizator.getMessageText(
            validationMessage,
        );

        return validationMessage === '';
    }

    @catchErrors({ restart: false })
    @asyncAction
    public *confirmTransaction(password: string) {
        const tx = {
            toAddress: this.userInput.toAddress,
            amount: moveDecimalPoint(this.userInput.amountEther, 18),
            fromAddress: this.fromAddress,
            currencyAddress: this.currencyAddress,
            gasPrice: moveDecimalPoint(this.gasPriceGwei, 9),
            gasLimit: this.gasLimit,
            timestamp: Date.now(),
        };

        this.userInput.toAddress = '';
        this.userInput.amountEther = '';

        if (tx.toAddress === tx.fromAddress) {
            this.rootStore.ui.addAlert({
                type: AlertType.warning,
                message: this.localizator.getMessageText([
                    'tx_sidechain_delay',
                    [],
                ]),
            });
        }

        const { data } = yield this.api.send(tx, password);
        const result = data as ISendTransactionResult;

        let alert;
        if (result.status === TransactionStatus.success) {
            alert = {
                type: AlertType.success,
                message: this.localizator.getMessageText([
                    'tx_has_been_completed',
                    [
                        moveDecimalPoint(
                            result.amount,
                            -result.decimalPointOffset,
                        ),
                        result.currencySymbol || '',
                        result.toAddress,
                        result.hash,
                    ],
                ]),
            };
        } else if (result.status === TransactionStatus.failed) {
            alert = {
                type: AlertType.error,
                message: this.localizator.getMessageText([
                    'tx_has_been_failed',
                    [result.toAddress, result.hash],
                ]),
            };
        } else {
            alert = {
                type: AlertType.error,
                message: JSON.stringify(result),
            };
        }

        this.rootStore.ui.addAlert(alert);

        return result;
    }
}

export default SendStore;

export * from './types';
