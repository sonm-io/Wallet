import { useStrict } from 'mobx';

import { UserStore } from './user';
import { SendStore } from './send';
import { MainStore } from './main';

useStrict(true);

export const Store = new UserStore();
export const userStore = new UserStore();
export const sendStore = new SendStore();
export const mainStore = new MainStore();

mainStore.init();

(window as any).___main = mainStore;
