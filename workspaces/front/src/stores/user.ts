import { observable, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'api';

export class UserStore {
  @observable
  public balance = '';

  @observable
  public isLoading = false;

  @observable
  public error = false;

  @observable
  public isAuth = false;

  @action
  public setAuth(value: boolean) {
    this.isAuth = value;
  }

  @asyncAction
  public async fetch() {
    this.isLoading = true;

    try {
      const response: api.IBalanceResponse = await api.methods.readBalance();

    } catch (e) {
      this.error = e.message;
    } finally {
      this.isLoading = false;
    }
  }
}
