import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import {
    Api,
    IAccountInfo,
    ISendTransactionResult,
    TransactionStatus,
} from 'app/api';
import * as BigNumber from 'bignumber.js';
import { ICurrencyItemProps } from 'app/components/common/currency-big-select';
import {
    ISendFormValues,
    TGasPricePriority,
    IPasswordCache,
    AlertType,

} from './types';
import { AbstractStore } from './abstract-store';
const { pending, catchErrors } = AbstractStore;
import { etherToGwei } from 'app/utils/ether-to-gwei';
import { gweiToEther } from 'app/utils/gwei-to-ether';
import { RootStore } from './';
import {
    validateEtherAddress,
    validatePositiveNumber,
    validatePositiveInteger,
} from 'app/utils/validation/';
import { createBigNumber } from 'app/utils/create-big-number';

const emptyForm: ISendFormValues = {
    fromAddress: '',
    toAddress: '',
    currencyAddress: '',
    amount: '',
    gasLimit: '',
    gasPrice: '',
    password: '',
};
Object.freeze(emptyForm);
// const allFormKeys = Object.keys(emptyForm) as Array<keyof ISendFormValues>;

export class SendStore extends AbstractStore {
    public static DEFAULT_GAS_LIMIT = '250000';

    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        super({ errorProcessor: rootStore.uiStore });

        this.rootStore = rootStore;
    }

    @observable public userInput: ISendFormValues = { ...emptyForm };

    @observable protected userInputTouched: Array<keyof ISendFormValues> = [];

    @observable protected serverValidation: ISendFormValues = { ...emptyForm };

    @computed public get fromAddress() {
        return this.userInput.fromAddress || this.rootStore.mainStore.accountMap.keys().next().value || '';
    }

    @computed public get currencyAddress() {
        return this.userInput.currencyAddress || this.rootStore.mainStore.currencyMap.keys().next().value || '';
    }

    @computed public get toAddress() {
        return this.userInput.toAddress;
    }

    protected isFieldTouched(fieldName: keyof ISendFormValues) {
        return this.userInputTouched.indexOf(fieldName) !== -1;
    }

    @computed public get validationToAddress() {
        const result: string[] = [];
        const toAddress = this.userInput.toAddress;

        if (this.isFieldTouched('toAddress')) {

            if (toAddress === '') {
                result.push('Required field');
            } else if (toAddress === this.fromAddress) {
                result.push('The destination address must differ the sender address');
            } else {
                result.push(...validateEtherAddress(toAddress));
            }
        }

        return result;
    }

    @computed public get validationGasPrice() {
        const result: string[] = [];
        const gasPrice = this.gasPriceGwei;

        if (this.isFieldTouched('gasPrice')) {
            if (gasPrice === '') {
                result.push('Required field');
            } else {
                result.push(...validatePositiveInteger(gasPrice));
            }
        }

        return result;
    }

    @computed public get amount() {
        return this.userInput.amount;
    }

    @computed public get validationAmount() {
        const result: string[] = [];
        const amount = this.userInput.amount;

        if (this.isFieldTouched('amount')) {
            if (amount === '') {
                result.push('Required field');
            } else {
                result.push(...validatePositiveNumber(amount));

                if (result.length === 0) {
                    const currentMax = createBigNumber(this.currentBalanceMaximum);

                    if (currentMax === undefined) {
                        result.push('Maximum values is undetermined');
                    } else if (currentMax.lessThan(amount)) {
                        result.push('Value is greater than maximum');
                    }
                }
            }
        }

        return result;
    }

    @computed public get gasLimit() {
        return this.userInput.gasLimit || SendStore.DEFAULT_GAS_LIMIT;
    }

    @computed public get validationGasLimit() {
        return this.userInput.gasLimit === ''
            ? []
            : validatePositiveInteger(this.userInput.gasLimit);
    }

    @computed public get isFormValid() {
        return this.validationToAddress.length === 0
            && this.validationGasPrice.length === 0
            && this.validationAmount.length === 0
            && this.validationGasLimit.length === 0;
    }

    @computed public get hasNecessaryValues() {
        return this.userInput.amount && this.userInput.toAddress;
    }

    @computed
    public get priority(): TGasPricePriority {
        let result: TGasPricePriority = 'normal';

        if (this.userInput.gasPrice !== '') {
            const [min, max] = this.rootStore.mainStore.gasPriceThresholds;
            const userInput = new BigNumber(gweiToEther(this.userInput.gasPrice));
            if (userInput.lessThanOrEqualTo(min)) {
                result = 'low';
            } else if (userInput.greaterThanOrEqualTo(max)) {
                result = 'high';
            }
        }

        return result;
    }

    @computed
    public get currentBalanceList(): ICurrencyItemProps[] {
        if (this.fromAddress === '') {
            return [];
        }

        return this.rootStore.mainStore.getBalanceListFor(this.fromAddress);
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
    protected setValidation(validation: Partial<ISendFormValues>) {
        this.serverValidation = { ...emptyForm, ...validation };
    }

    @action.bound
    public resetValidation() {
        this.serverValidation = { ...emptyForm };
    }

    @action.bound
    public resetUserInput() {
        this.resetValidation();
        this.userInputTouched = [];
        this.userInput = {
            ...emptyForm,
            gasPrice: this.userInput.gasPrice,
            gasLimit: this.userInput.gasLimit,
        };
    }

    protected passwordCache: IPasswordCache = {};
    @pending
    @asyncAction
    public * checkSelectedAccountPassword(password: string) {
        const accountAddress = this.fromAddress;

        let validationMessage = '';

        if (accountAddress in this.passwordCache
            && this.passwordCache[accountAddress] === password) {
            validationMessage = '';
        } else {
            const {data: privateKey, validation} = yield Api.getPrivateKey(password, accountAddress);

            if (privateKey) {
                this.passwordCache[accountAddress] = password;
                validationMessage = '';
            } else if (validation && validation.password) {
                validationMessage = validation.password;
            }
        }

        this.serverValidation.password = validationMessage;

        return validationMessage === '';
    }

    @computed get gasPriceEther() {
        return this.userInput.gasPrice
            ? gweiToEther(this.userInput.gasPrice)
            : this.rootStore.mainStore.averageGasPriceEther;
    }

    @computed get gasPriceGwei() {
        return this.userInput.gasPrice
            ? this.userInput.gasPrice
            : this.averageGasPriceGwei;
    }

    @computed get averageGasPriceGwei() {
        return etherToGwei(this.rootStore.mainStore.averageGasPriceEther);
    }

    @catchErrors({ restart: false })
    @asyncAction
    public * confirmTransaction(password: string) {
        const tx = {
            toAddress: this.userInput.toAddress,
            amount: this.userInput.amount,
            fromAddress: this.fromAddress,
            currencyAddress: this.currencyAddress,
            gasPrice: this.gasPriceEther,
            gasLimit: this.userInput.gasLimit,
            timestamp: Date.now(),
        };

        this.userInput.toAddress = '';
        this.userInput.amount = '';

        const { data } = yield Api.send(tx, password);

        const result = data as ISendTransactionResult;

        let alert;
        if (result.status === TransactionStatus.success) {
            const currency = this.rootStore.mainStore.currencyMap.get(result.currencyAddress);
            const currencyName = currency ? currency.symbol : '';

            alert = {
                type: AlertType.success,
                message: `Transaction is completed successfully. \
${result.amount} ${currencyName} has been sent to the address ${result.toAddress}. TxHash ${result.hash}`,
            };
        } else if (result.status === TransactionStatus.failed) {
            alert = {
                type: AlertType.error,
                message: `Transaction to the address ${result.toAddress} was failed. TxHash ${result.hash}`,
            };
        } else {
            alert = {
                type: AlertType.error,
                message: JSON.stringify(result),
            };
        }

        this.rootStore.uiStore.addAlert(alert);

        return result;
    }

    @computed
    get currentBalanceMaximum() {
        const account = this.rootStore.mainStore.accountMap.get(
            this.fromAddress,
        ) as IAccountInfo;

        let amount = new BigNumber(
            account.currencyBalanceMap[this.currencyAddress],
        );

        if (this.rootStore.mainStore.etherAddress === this.currencyAddress) {
            const fee = new BigNumber(this.gasPriceEther).mul(this.gasLimit);
            amount = amount.minus(fee);
        }

        return amount.lessThan(0) ? '0' : amount.toString();
    }
}

export default SendStore;

export * from './types';
