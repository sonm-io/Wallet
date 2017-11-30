import { useStrict } from 'mobx';

import { UserStore } from './user';
import { HistoryStore } from './history';
import { MainStore } from './main';

useStrict(true);

export const Store = new UserStore();
export const historyStore = new HistoryStore();
export const mainStore = new MainStore();

(window as any).___main = mainStore;
(window as any).___history = historyStore;
