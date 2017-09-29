import { observable, action, computable } from 'mobx';
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
  public error = false;

  @observable
  public address = '';

  @computable
  public get isAuth() {
    return this.address !== '';
  }

  @action
  public setAddress(address: string) {
    this.address = address;
  }

  @asyncAction
  public async fetch() {
    this.isLoading = true;

    try {
      const response: api.IBalanceResponse = await api.methods.readBalance();
      this.ethBalance = response.data.balance;
      this.snmBalance = response.data.tokenBalance;

    } catch (e) {
      this.error = e.message;
    } finally {
      this.isLoading = false;
    }
  }
}
