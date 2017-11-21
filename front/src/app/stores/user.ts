import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'app/api';

export class UserStore {
    @observable public ethBalance = '';

    @observable public snmBalance = '';

    @observable public isLoading = false;

    @observable public error = '';

    @observable public address = '';

    @computed
    public get isAuth() {
        return this.address !== '';
    }

    @action.bound
    public setAddress(address: string) {
        this.address = address;
    }

    @asyncAction
    public *fetch() {
        this.isLoading = true;

        try {
            const response: api.IResponse = yield api.methods.getBalance(this.address);
            this.ethBalance = response.data.eth;
            this.snmBalance = response.data.snmt;
        } catch (e) {
            this.error = String(e);
        } finally {
            this.isLoading = false;
        }
    }
}
