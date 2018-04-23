import { useStrict } from 'mobx';
import { IProfileBrief } from 'app/api/types';
import { HistoryStore } from './history';
import { MainStore } from './main';
import { SendStore } from './send';
import { UiStore } from './ui';
import { AddTokenStore } from './add-token';
import { OnlineStore } from './online-store';
import {
    localizator as en,
    ILocalizator,
    IHasLocalizator,
} from 'app/localization';
import { IListStore } from './list-store-factory';
import { ProfileList } from './profile-list';

import { Api } from 'app/api';

useStrict(true);

export class RootStore implements IHasLocalizator {
    public readonly historyStore: HistoryStore;
    public readonly dwHistoryStore: HistoryStore;
    public readonly mainStore: MainStore;
    public readonly sendStore: SendStore;
    public readonly depositStore: SendStore;
    public readonly withdrawStore: SendStore;
    public readonly uiStore: UiStore;
    public readonly addTokenStore: AddTokenStore;
    public readonly profileListStore: IListStore<IProfileBrief>;

    constructor(localizator: ILocalizator) {
        this.localizator = localizator;

        // should be first cause used in all stores;
        this.uiStore = new UiStore();

        this.historyStore = new HistoryStore(this, this.localizator, 'send');
        this.dwHistoryStore = new HistoryStore(this, this.localizator, 'dw');

        this.mainStore = new MainStore(this, this.localizator);

        this.sendStore = new SendStore(this, this.localizator, {
            getPrivateKey: Api.getPrivateKey,
            send: Api.send,
        });

        this.depositStore = new SendStore(
            this,
            this.localizator,
            {
                getPrivateKey: Api.getPrivateKey,
                send: Api.deposit,
            },
            true,
        );

        this.withdrawStore = new SendStore(
            this,
            this.localizator,
            {
                getPrivateKey: Api.getPrivateKey,
                send: Api.withdraw,
            },
            true,
        );

        this.addTokenStore = new AddTokenStore(this, this.localizator);
        this.profileListStore = new ProfileList({
            errorProcessor: this.uiStore,
            localizator: this.localizator,
        });
    }

    public get isPending() {
        return OnlineStore.getAccumulatedFlag(
            'isPending',
            this.historyStore,
            this.dwHistoryStore,
            this.mainStore,
            this.sendStore,
            this.depositStore,
            this.withdrawStore,
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
            this.dwHistoryStore,
            this.depositStore,
            this.withdrawStore,
        );
    }

    public readonly localizator: ILocalizator;
}

export const rootStore = new RootStore(en);

(window as any).__rootStore = rootStore;

export default rootStore;
