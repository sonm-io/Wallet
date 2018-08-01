import { observable, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import Api from 'app/api';
import { ICurrencyInfo } from 'app/api/types';
import updateAddressMap from 'app/stores/utils/update-address-map';
import normalizeCurrencyInfo from 'app/stores/utils/normalize-currency-info';
import { RootStore } from 'app/stores';
const { pending, catchErrors } = OnlineStore;

const emptyCurrencyInfo = {
    symbol: '',
    decimalPointOffset: 2,
    name: '',
    address: '',
    balance: '', // ToDo a remove balance from Info interface
};

export class CurrencyStore extends OnlineStore {
    protected static ADDRESS_ETHER = '0x';

    protected rootStore: RootStore;

    constructor(rootStore: RootStore, services: IOnlineStoreServices) {
        super(services);
        this.rootStore = rootStore;
        autorun(() => {
            if (this.rootStore.loginStore.success) {
                this.init();
            }
        });
    }

    @asyncAction
    protected *init() {
        const { data: currencyList } = yield Api.getCurrencyList();
        this.primaryTokenAddr = (yield Api.getSonmTokenAddress()).data;
        updateAddressMap<ICurrencyInfo>(
            currencyList.map(normalizeCurrencyInfo),
            this.currencyMap,
        );
    }

    @pending
    @catchErrors({ restart: true })
    @asyncAction
    public *removeToken(address: string) {
        const success = yield Api.removeToken(address);

        if (success) {
            this.currencyMap.delete(address);
        }
    }

    @observable public currencyMap = new Map<string, ICurrencyInfo>();

    @computed
    public get currencyAddressList() {
        return Array.from(this.currencyMap.keys());
    }

    @computed
    public get etherInfo(): ICurrencyInfo {
        const result = this.currencyMap.get(this.etherAddress);

        if (!result) {
            throw new Error(`Ether not found`);
        }

        return result;
    }

    public get etherAddress(): string {
        return CurrencyStore.ADDRESS_ETHER;
    }

    @computed
    public get primaryTokenInfo(): ICurrencyInfo {
        const result = this.currencyMap.get(this.primaryTokenAddress);
        return result || emptyCurrencyInfo;
    }

    protected primaryTokenAddr: string = '';
    public get primaryTokenAddress(): string {
        return this.primaryTokenAddr;
    }
}
