import { useStrict } from 'mobx';

import { HistoryStore } from './history';
import { MainStore } from './main';
import { SendStore } from './send';
import { UiStore } from './ui';
import { AddTokenStore } from './add-token';
import { OnlineStore } from './online-store';

useStrict(true);

export class RootStore {
    public historyStore: HistoryStore;
    public mainStore: MainStore;
    public sendStore: SendStore;
    public uiStore: UiStore;
    public addTokenStore: AddTokenStore;

    constructor() {
        // should be first cause used in all stores;
        this.uiStore = new UiStore();

        this.historyStore = new HistoryStore(this);
        this.mainStore = new MainStore(this);
        this.sendStore = new SendStore(this);
        this.addTokenStore = new AddTokenStore(this);
    }

    public get isPending() {
        return OnlineStore.getAccumulatedFlag(
            'isPending',
            this.historyStore,
            this.mainStore,
            this.sendStore,
            this.addTokenStore,
        );
    }

    public get isOffline() {
        return OnlineStore.getAccumulatedFlag(
            'isOffline',
            this.historyStore,
            this.mainStore,
            this.sendStore,
            this.addTokenStore,
        );
    }
}

export const rootStore = new RootStore();

(window as any).__rootStore = rootStore;

export default rootStore;
