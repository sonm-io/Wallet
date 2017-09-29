import { useStrict } from 'mobx';

import { UserStore } from './user';

useStrict(true);

export const userStore = new UserStore();
