import { observable, action, computed } from 'mobx';

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
}
