import { useStrict } from 'mobx';

import { HistoryStore } from './history';
import { MainStore } from './main';
import { SendStore } from './send';
import { UiStore } from './ui';

useStrict(true);

export class RootStore {
    public historyStore: HistoryStore;
    public mainStore: MainStore;
    public sendStore: SendStore;
    public uiStore: UiStore;

    constructor() {
        // should be first cause used in all stores;
        this.uiStore = new UiStore();

        this.historyStore = new HistoryStore(this);
        this.mainStore = new MainStore(this);
        this.sendStore = new SendStore(this);
    }
}

export const rootStore = new RootStore();

(window as any).__rootStore = rootStore;

export default rootStore;
