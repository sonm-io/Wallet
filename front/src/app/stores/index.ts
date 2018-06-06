import { useStrict } from 'mobx';
import { IProfileBrief, IOrder, IDeal } from 'app/api/types';
import { HistoryStore } from './history';
import { MainStore } from './main';
import { SendStore } from './send';
import { WithdrawStore } from './withdraw';
import { MarketStore } from './market';
import { UiStore } from './ui';
import { AddTokenStore } from './add-token';
import { OnlineStore } from './online-store';
import { ProfileFilterStore } from './profile-filter';
import { DealFilterStore } from './deal-filter';
import { OrderFilterStore } from './order-filter';
import {
    localizator as en,
    ILocalizator,
    IHasLocalizator,
} from 'app/localization';
import { ProfileList } from './profile-list';
import { OrdersList } from './orders-list';
import { DealList } from './deal-list';
import { Api } from 'app/api';
import { THistorySourceMode } from './types';
import { IListStore } from './list-store';
import { unwrapApiResult } from '../api/utils/unwrap-api-result';
import { OrderDetails } from './order-details';
import { DealDetails } from './deal-details';

useStrict(true);

export class RootStore implements IHasLocalizator {
    public readonly historyStore: HistoryStore;
    public readonly dwHistoryStore: HistoryStore;
    public readonly mainStore: MainStore;
    public readonly sendStore: SendStore;
    public readonly depositStore: SendStore;
    public readonly withdrawStore: WithdrawStore;
    public readonly uiStore: UiStore;
    public readonly addTokenStore: AddTokenStore;
    public readonly profileListStore: IListStore<IProfileBrief>;
    public readonly dealListStore: IListStore<IDeal>;
    public readonly ordersListStore: IListStore<IOrder>;
    public readonly marketStore: MarketStore;
    public readonly profileFilterStore: ProfileFilterStore;
    public readonly dealFilterStore: DealFilterStore;
    public readonly orderFilterStore: OrderFilterStore;
    public readonly orderDetailsStore: OrderDetails;
    public readonly dealDetailsStore: DealDetails;

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

        this.withdrawStore = new WithdrawStore(
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
                fetchValidators: unwrapApiResult(Api.getValidators),
                fetchMarketStats: Api.deal.fetchStats,
            },
        });

        this.profileFilterStore = new ProfileFilterStore();

        this.addTokenStore = new AddTokenStore(this, this.localizator);
        this.profileListStore = new ProfileList(
            {
                filter: this.profileFilterStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.profile,
            },
        );

        this.orderFilterStore = new OrderFilterStore();

        this.ordersListStore = new OrdersList(
            {
                filter: this.orderFilterStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.order,
            },
        );

        this.dealFilterStore = new DealFilterStore();

        this.dealListStore = new DealList(
            {
                filter: this.dealFilterStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.deal,
            },
        );

        this.orderDetailsStore = new OrderDetails(
            this,
            {
                market: this.marketStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.order,
            },
        );

        this.dealDetailsStore = new DealDetails(
            this,
            {
                market: this.marketStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.deal,
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
            this.orderDetailsStore,
            this.dealDetailsStore,
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
