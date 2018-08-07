import { OnlineStore, IOnlineStoreServices } from './online-store';
import { IWalletListItem } from 'app/api';
import { RootStore } from 'app/stores';
const { pending, catchErrors } = OnlineStore;

export class LoginStore extends OnlineStore {
    protected rootStore: RootStore;

    constructor(rootStore: RootStore, services: IOnlineStoreServices) {
        super(services);
        this.rootStore = rootStore;
    }

    @catchErrors({ restart: true })
    @pending
    public *onLogin(wallet: IWalletListItem) {
        yield Promise.all([
            this.rootStore.mainStore.init(),
            this.rootStore.walletStore.init(wallet),
            this.rootStore.gasPrice.init(),
            this.rootStore.uiStore.init(),
        ]);
    }
}
