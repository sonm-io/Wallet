import { observable, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'app/api';

export interface ISendStore {
    form: {
        from: string;
        to: string;
        amount: string;
        currency: string;
        gasLimit: string;
        gasPrice: string;
    };

    currencyList: api.ICurrencyInfo[];
    accountList: api.IAccountInfo[];

    submitTransaction(form: ISendForm, password: string): void;
}

export interface ISendForm {
    from: string;
    to: string;
    amount: string;
    gasPrice: string;
    gasLimit: string;
    currency: string;
}

export class SendStore implements ISendStore {
    @observable
    public form: ISendForm = {
        from: '',
        to: '',
        amount: '',
        gasPrice: '',
        gasLimit: '',
        currency: '',
    };

    @observable public averageGasPrice = '';

    @observable public error = '';

    @observable public currencyList: api.ICurrencyInfo[];

    @observable public accountList: api.IAccountInfo[];

    @action
    public useMaximum() {
        this.form.amount = '1234';
    }

    @asyncAction
    public *submitTransaction(form: ISendForm, password: string) {
        try {
            yield api.methods.send(
                form.from,
                form.to,
                form.amount,
                form.currency,
                form.gasPrice,
                form.gasLimit,

                password,
            );
        } catch (e) {
            this.error = String(e);
        }
    }

    @asyncAction
    public *init() {
        const [
            averageGasPrice,
            accountList,
            currencyList,
        ] = yield Promise.all([
            api.methods.getGasPrice(),
            api.methods.getAccountList(),
            api.methods.getCurrencyList(),
        ]);

        this.averageGasPrice = averageGasPrice;
        this.accountList = accountList;
        this.currencyList = currencyList;
    }
}
