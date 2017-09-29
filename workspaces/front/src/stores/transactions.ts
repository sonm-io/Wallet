import { observable, action, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import * as api from 'api';

export interface ITransaction {
  from: string;
  to: string;
  qty: string;
  gasPrice: string;
  gasLimit: string;
}

export class TransactionsStore {
  @observable
  public gasLimit = '';

  @observable
  public gasPrice = '';

  @observable
  public isLoading = false;

  @observable
  public error = '';

  @observable
  public transactions: ITransaction[] = [];

  @action.addTransaction()
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
