import { useStrict } from 'mobx';
import { IProfileBrief, IOrder, IDeal, IWorker } from 'app/api/types';
import { HistoryListStore } from './history-list';
import { HistoryFilterStore } from './history-filter';
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
import { WorkerList } from './worker-list';
import { WorkerFilterStore } from './worker-filter';
import { Api } from 'app/api';
import { EnumHistorySourceMode } from './types';
import { IListStore } from './list-store';
import { unwrapApiResult } from '../api/utils/unwrap-api-result';
import { OrderDetails } from './order-details';
import { DealDetails } from './deal-details';
import { KycListStore } from './kyc-list';
import { ProfileDetails } from './profile-details';
import { MyProfilesStore } from './my-profiles';
import { LoginStore } from './login';
import { CurrencyStore } from './currency';

useStrict(true);

export class RootStore implements IHasLocalizator {
    public readonly loginStore: LoginStore;
    public readonly walletHistoryListStore: HistoryListStore;
    public readonly walletHistoryFilterStore: HistoryFilterStore;
    public readonly dwHistoryListStore: HistoryListStore;
    public readonly dwHistoryFilterStore: HistoryFilterStore;
    public readonly mainStore: MainStore;
    public readonly sendStore: SendStore;
    public readonly depositStore: SendStore;
    public readonly withdrawStore: WithdrawStore;
    public readonly uiStore: UiStore;
    public readonly addTokenStore: AddTokenStore;
    public readonly profileListStore: IListStore<IProfileBrief>;
    public readonly dealListStore: IListStore<IDeal>;
    public readonly workerListStore: IListStore<IWorker>;
    public readonly workerFilterStore: WorkerFilterStore;
    public readonly ordersListStore: IListStore<IOrder>;
    public readonly marketStore: MarketStore;
    public readonly profileFilterStore: ProfileFilterStore;
    public readonly dealFilterStore: DealFilterStore;
    public readonly orderFilterStore: OrderFilterStore;
    public readonly orderDetailsStore: OrderDetails;
    public readonly dealDetailsStore: DealDetails;
    public readonly kycListStore: KycListStore;
    public readonly profileDetailsStore: ProfileDetails;
    public readonly currencyStore: CurrencyStore;
    public readonly myProfilesStore: MyProfilesStore;

    constructor(localizator: ILocalizator) {
        this.localizator = localizator;

        // should be first cause used in all stores;
        this.uiStore = new UiStore(this);

        this.loginStore = new LoginStore({
            localizator,
            errorProcessor: this.uiStore,
        });

        this.walletHistoryFilterStore = new HistoryFilterStore(
            EnumHistorySourceMode.wallet,
        );
        this.walletHistoryListStore = new HistoryListStore(
            {
                filter: this.walletHistoryFilterStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.history,
            },
            true,
        );

        this.dwHistoryFilterStore = new HistoryFilterStore(
            EnumHistorySourceMode.market,
        );

        this.dwHistoryListStore = new HistoryListStore(
            {
                filter: this.dwHistoryFilterStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.history,
            },
            true,
        );

        this.currencyStore = new CurrencyStore(this, {
            localizator,
            errorProcessor: this.uiStore,
        });

        this.myProfilesStore = new MyProfilesStore(this, {
            localizator,
            errorProcessor: this.uiStore,
        });

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
            '150000',
        );

        this.withdrawStore = new WithdrawStore(
            this,
            this.localizator,
            {
                getPrivateKey: Api.getPrivateKey,
                send: Api.withdraw,
            },
            true,
            '150000',
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

        this.orderFilterStore = new OrderFilterStore(this);

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

        this.dealFilterStore = new DealFilterStore(this);

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

        this.workerFilterStore = new WorkerFilterStore(this);

        this.workerListStore = new WorkerList(
            {
                filter: this.workerFilterStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
                api: Api.worker,
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

        this.kycListStore = new KycListStore(
            this,
            {
                main: this.mainStore,
                market: this.marketStore,
            },
            {
                localizator,
                errorProcessor: this.uiStore,
            },
        );

        this.profileDetailsStore = new ProfileDetails(this, {
            localizator,
            errorProcessor: this.uiStore,
            api: Api.profile,
        });
    }

    public get isPending() {
        return OnlineStore.getAccumulatedFlag(
            'isPending',
            this.walletHistoryListStore,
            this.dwHistoryListStore,
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
            this.walletHistoryListStore,
            this.dwHistoryListStore,
            this.mainStore,
            this.sendStore,
            this.addTokenStore,
            this.depositStore,
            this.withdrawStore,
        );
    }

    public readonly localizator: ILocalizator;
}

export const rootStore = new RootStore(en);

(window as any).__rootStore = rootStore;

export default rootStore;
