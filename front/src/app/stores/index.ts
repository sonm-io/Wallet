import { useStrict } from 'mobx';

import { HistoryStore } from './history';
import { MainStore } from './main';
import { SendStore } from './send';
import { UiStore } from './ui';
import { AddTokenStore } from './add-token';
import { OnlineStore } from './online-store';
import { localizator, ILocalizator, IHasLocalizator } from 'app/localization';

useStrict(true);

export class RootStore implements IHasLocalizator {
    public readonly historyStore: HistoryStore;
    public readonly mainStore: MainStore;
    public readonly sendStore: SendStore;
    public readonly uiStore: UiStore;
    public readonly addTokenStore: AddTokenStore;

    constructor(localizator: ILocalizator) {
        this.localizator = localizator;

        // should be first cause used in all stores;
        this.uiStore = new UiStore();

        this.historyStore = new HistoryStore(this, this.localizator);
        this.mainStore = new MainStore(this, this.localizator);
        this.sendStore = new SendStore(this, this.localizator);
        this.addTokenStore = new AddTokenStore(this, this.localizator);
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

    public readonly localizator: ILocalizator;
}

export const rootStore = new RootStore(localizator);

(window as any).__rootStore = rootStore;

export default rootStore;
