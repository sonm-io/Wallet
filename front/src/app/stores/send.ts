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

    currencyMap: ICurrencyMap;
    accountMap: IAccountMap;

    loadCurrencies(): void;

    loadAccounts(): void;

    submitTransaction(form: ISendForm, password: string): void;
}

export interface IAccountMap {
    [accountAddr: string]: api.IAccountInfo;
}

export interface ICurrencyMap {
    [currencyAddr: string]: api.ICurrencyInfo;
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

    @observable public error = '';

    @observable public currencyMap: ICurrencyMap = {};

    @observable public accountMap: IAccountMap;

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
    public *loadAccounts() {
        try {
            const accounts = yield api.methods.getAccountList();

            this.accountMap = accounts.reduce((acc: IAccountMap, account: api.IAccountInfo) => {
                acc[account.address] = account;

                return acc;
            }, {});

            this.form.amount = accounts[0].address;
        } catch (e) {
            this.error = String(e);
        }
    }

    @asyncAction
    public *loadCurrencies() {
        try {
            this.accountMap = (yield api.methods.getCurrencyList()).reduce(
                (acc: ICurrencyMap, currency: api.ICurrencyInfo) => {
                    acc[currency.address] = currency;

                    return acc;
                },
                {},
            );
        } catch (e) {
            this.error = String(e);
        }
    }
}
