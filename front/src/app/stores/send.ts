import { observable, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'app/api';

const Api = api.Api;

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

    submitTransaction(form: api.ISendTransactionParams, password: string): void;
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
    public *submitTransaction(form: api.ISendTransactionParams, password: string) {
        try {
            const result = yield Api.send(form);

            console.log(result);
        } catch (e) {
            this.error = String(e);
        }
    }

    @asyncAction
    public *init() {
        const [
            { data: averageGasPrice },
            { data: accountList },
            { dsata: currencyList},
        ] = yield Promise.all([
            Api.getGasPrice(),
            Api.getAccountList(),
            Api.getCurrencyList(),
        ]);

        this.averageGasPrice = averageGasPrice;
        this.accountList = accountList;
        this.currencyList = currencyList;
    }
}
