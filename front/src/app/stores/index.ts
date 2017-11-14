import { useStrict } from 'mobx';

import { UserStore } from './user';
import { SendStore } from './send';

useStrict(true);

export const Store = new UserStore();
export const userStore = new UserStore();
export const sendStore = new SendStore();
