import { useStrict } from 'mobx';

import { UserStore } from './user';
import { TransactionStore } from './transaction';

useStrict(true);

export const Store = new UserStore();
export const userStore = new UserStore();
export const transactionStore = new TransactionStore();
