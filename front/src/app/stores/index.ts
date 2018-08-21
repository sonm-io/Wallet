import { useStrict } from 'mobx';
import { IOrder, IDeal, IWorker } from 'app/api/types';
import { HistoryListStore } from './history-list';
import { HistoryFilterStore } from './history-filter';
import { MainStore } from './main';
import { SendStore } from './send';
import { WithdrawStore } from './withdraw';
import { ValidatorsStore } from './validators';
import { UiStore } from './ui';
import { AddTokenStore } from './add-token';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import { ProfileFilterStore } from './profile-filter';
import { DealFilterStore } from './deal-filter';
import { OrderFilterStore } from './order-filter';
import { OrderCreateStore } from './order-create';
import { ILocalizator, IHasLocalizator } from 'app/localization';
import { ProfileList } from './profile-list';
import { OrdersList } from './orders-list';
import { DealList } from './deal-list';
import { WorkerList } from './worker-list';
import { WorkerFilterStore } from './worker-filter';
import { Api } from 'app/api';
import { EnumHistorySourceMode } from './types';
import {
    IListStore,
    IReactiveDependecies,
    IFilterRead,
    IListStoreServices,
    IListStoreApi,
} from './list-store';
import { unwrapApiResult } from '../api/utils/unwrap-api-result';
import { OrderDetails } from './order-details';
import { DealDetails } from './deal-details';
import { KycListStore } from './kyc-list';
import { ProfileDetails } from './profile-details';
import { MyProfilesStore } from './my-profiles';
import { CurrencyStore } from './currency';
import { WalletStore } from './wallet';
import { GasPriceStore } from './gas-price';
import { IProfile } from 'common/types/profile';

useStrict(true);

export class RootStore implements IHasLocalizator {
    public readonly walletHistoryList: HistoryListStore;
    public readonly walletHistoryFilter: HistoryFilterStore;
    public readonly dwHistoryList: HistoryListStore;
    public readonly dwHistoryFilter: HistoryFilterStore;
    public readonly main: MainStore;
    public readonly send: SendStore;
    public readonly deposit: SendStore;
    public readonly withdraw: WithdrawStore;
    public readonly ui: UiStore;
    public readonly addToken: AddTokenStore;
    public readonly profileList: IListStore<IProfile>;
    public readonly dealList: IListStore<IDeal>;
    public readonly workerList: IListStore<IWorker>;
    public readonly workerFilter: WorkerFilterStore;
    public readonly ordersList: IListStore<IOrder>;
    public readonly orderCreate: OrderCreateStore;
    public readonly validators: ValidatorsStore;
    public readonly profileFilter: ProfileFilterStore;
    public readonly dealFilter: DealFilterStore;
    public readonly orderFilter: OrderFilterStore;
    public readonly orderDetails: OrderDetails;
    public readonly dealDetails: DealDetails;
    public readonly kycList: KycListStore;
    public readonly profileDetails: ProfileDetails;
    public readonly currency: CurrencyStore;
    public readonly myProfiles: MyProfilesStore;
    public readonly wallet: WalletStore;
    public readonly gasPrice: GasPriceStore;

    //#region Store Factories
    protected createList<T, TItem>(
        StoreClass: new (
            filter: IReactiveDependecies,
            services: IListStoreServices<TItem>,
            allowFetch?: boolean,
        ) => T,
        filter: IFilterRead,
        api: IListStoreApi<TItem>,
        allowFetch?: boolean,
    ) {
        return new StoreClass(
            {
                filter,
            },
            {
                localizator: this.localizator,
                errorProcessor: this.ui,
                api,
            },
            allowFetch,
        );
    }

    protected createOnline<T>(
        StoreClass: new (services: IOnlineStoreServices) => T,
    ) {
        return new StoreClass({
            localizator: this.localizator,
            errorProcessor: this.ui,
        });
    }

    protected createWithRoot<T>(
        StoreClass: new (root: RootStore, services: IOnlineStoreServices) => T,
    ) {
        return new StoreClass(this, {
            localizator: this.localizator,
            errorProcessor: this.ui,
        });
    }

    protected createWithServices<T, TService extends object>(
        StoreClass: new (
            root: RootStore,
            services: TService & IOnlineStoreServices,
        ) => T,
        services: TService,
    ) {
        // Can't write with strict types because of https://github.com/Microsoft/TypeScript/issues/14409
        const args: any = {
            ...(services as object),
            localizator: this.localizator,
            errorProcessor: this.ui,
        };
        return new StoreClass(this, args as TService & IOnlineStoreServices);
    }

    protected create<T>(
        StoreClass: new (
            root: RootStore,
            services: IOnlineStoreServices,
            ...rest: any[]
        ) => T,
        ...rest: any[]
    ) {
        return new StoreClass(
            this,
            {
                localizator: this.localizator,
                errorProcessor: this.ui,
            },
            ...rest,
        );
    }
    //#endregion

    constructor(localizator: ILocalizator) {
        this.localizator = localizator;

        // should be first cause used in all stores;
        this.ui = new UiStore(this);

        this.walletHistoryFilter = new HistoryFilterStore(
            EnumHistorySourceMode.wallet,
        );

        this.walletHistoryList = this.createList(
            HistoryListStore,
            this.walletHistoryFilter,
            Api.history,
            true,
        );

        this.dwHistoryFilter = new HistoryFilterStore(
            EnumHistorySourceMode.market,
        );

        this.dwHistoryList = this.createList(
            HistoryListStore,
            this.dwHistoryFilter,
            Api.history,
            true,
        );

        this.gasPrice = this.createOnline(GasPriceStore);

        this.wallet = this.createOnline(WalletStore);

        this.currency = this.createWithRoot(CurrencyStore);

        this.myProfiles = this.createWithServices(MyProfilesStore, {
            profileApi: Api.profile,
            marketApi: {
                fetchMarketBalance: unwrapApiResult(Api.getMarketBalance),
                fetchMarketStats: Api.deal.fetchStats,
            },
        });

        this.main = this.createWithRoot(MainStore);

        this.send = this.create(SendStore, {
            getPrivateKey: Api.getPrivateKey,
            send: Api.send,
        });

        this.deposit = this.create(
            SendStore,
            {
                getPrivateKey: Api.getPrivateKey,
                send: Api.deposit,
            },
            true,
            '150000',
        );

        this.withdraw = this.create(
            WithdrawStore,
            {
                getPrivateKey: Api.getPrivateKey,
                send: Api.withdraw,
            },
            true,
            '150000',
        );

        this.validators = this.createWithServices(ValidatorsStore, {
            api: {
                fetchValidators: unwrapApiResult(Api.getValidators),
            },
        });

        this.profileFilter = new ProfileFilterStore();

        this.addToken = new AddTokenStore(this, this.localizator);
        this.profileList = this.createList(
            ProfileList,
            this.profileFilter,
            Api.profile,
        );

        this.orderFilter = new OrderFilterStore(this);
        this.ordersList = this.createList(
            OrdersList,
            this.orderFilter,
            Api.order,
        );

        this.orderCreate = this.createWithServices(OrderCreateStore, {
            profileApi: Api.profile,
        });

        this.dealFilter = new DealFilterStore(this);
        this.dealList = this.createList(DealList, this.dealFilter, Api.deal);

        this.workerFilter = new WorkerFilterStore(this);
        this.workerList = this.createList(
            WorkerList,
            this.workerFilter,
            Api.worker,
        );

        this.orderDetails = this.createWithServices(OrderDetails, {
            api: Api.order,
        });

        this.dealDetails = this.createWithServices(DealDetails, {
            api: Api.deal,
        });

        this.kycList = this.createWithRoot(KycListStore);

        this.profileDetails = this.createWithServices(ProfileDetails, {
            api: Api.profile,
        });
    }

    public get isPending() {
        return OnlineStore.getAccumulatedFlag(
            'isPending',
            this.walletHistoryList,
            this.dwHistoryList,
            this.main,
            this.send,
            this.deposit,
            this.withdraw,
            this.addToken,
            this.orderDetails,
            this.dealDetails,
            this.orderCreate,
        );
    }

    public get isOffline() {
        return OnlineStore.getAccumulatedFlag(
            'isOffline',
            this.walletHistoryList,
            this.dwHistoryList,
            this.main,
            this.send,
            this.addToken,
            this.deposit,
            this.withdraw,
        );
    }

    public readonly localizator: ILocalizator;
}
