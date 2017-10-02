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

  @asyncAction
  public *processTransaction(transaction: ITransaction) {
    this.isLoading = true;

    try {
      const response = yield api.methods.processTransaction();
      debugger;

    } catch (e) {
      this.error = String(e);
    } finally {
      this.isLoading = false;
    }
  }
}
