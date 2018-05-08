import { useStrict } from 'mobx';
import { IProfileBrief } from 'app/api/types';
import { HistoryStore } from './history';
import { MainStore } from './main';
import { SendStore } from './send';
import { MarketStore } from './market';
import { UiStore } from './ui';
import { AddTokenStore } from './add-token';
import { OnlineStore } from './online-store';
import { ProfileFilterStore } from './profile-filter';
import {
    localizator as en,
    ILocalizator,
    IHasLocalizator,
} from 'app/localization';
import { ProfileList } from './profile-list';
import { Api } from 'app/api';
import { THistorySourceMode } from './types';
import { IListStore, IListServerQuery } from './list-store';
import { unwrapApiResult } from './utils/unwrap-api-result';

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
    public readonly marketStore: MarketStore;
    public readonly profileFilterStore: ProfileFilterStore;

    constructor(localizator: ILocalizator) {
        this.localizator = localizator;

        // should be first cause used in all stores;
        this.uiStore = new UiStore();

        this.historyStore = new HistoryStore(
            this,
            this.localizator,
            THistorySourceMode.wallet,
        );
        this.dwHistoryStore = new HistoryStore(
            this,
            this.localizator,
            THistorySourceMode.market,
        );

        this.mainStore = new MainStore(this, { localizator: this.localizator });

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

        this.marketStore = new MarketStore(this, {
            localizator: this.localizator,
            errorProcessor: this.uiStore,
            api: {
                fetchMarketBalance: unwrapApiResult(Api.getMarketBalance),
            },
        });

        this.profileFilterStore = new ProfileFilterStore();

        this.addTokenStore = new AddTokenStore(this, this.localizator);
        this.profileListStore = new ProfileList(
            {
                filter: this.profileFilterStore,
            },
            {
                errorProcessor: this.uiStore,
                localizator: this.localizator,
                api: {
                    fetchList: async (query: IListServerQuery) => {
                        const result = await Api.getProfileList({
                            offset: query.offset,
                            limit: query.limit,
                            sortBy: query.sortBy,
                            sortDesc: query.sortDesc,
                        });

                        return (result as any).data.records;
                    },
                },
            },
        );
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
