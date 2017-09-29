import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'api';

export class UserStore {
  @observable
  public ethBalance = '';

  @observable
  public snmBalance = '';

  @observable
  public isLoading = false;

  @observable
  public error = '';

  @observable
  public address = '';

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
      const response: api.IBalanceResponse = yield api.methods.readBalance();
      this.ethBalance = response.data.balance;
      this.snmBalance = response.data.token_balance;

    } catch (e) {
      this.error = String(e);
    } finally {
      this.isLoading = false;
    }
  }
}
