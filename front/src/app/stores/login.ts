import { observable, computed } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import Api, { IValidation, IWalletListItem } from 'app/api';
import { RootStore } from 'app/stores';
const { pending, catchErrors } = OnlineStore;

interface ILoginStoreState {
    success: boolean;
    validation?: IValidation;
}

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

    @observable
    private state: ILoginStoreState = {
        success: false,
    };

    @computed
    public get success(): boolean {
        return this.state.success;
    }

    @computed
    public get validation(): IValidation | undefined {
        return this.state.validation;
    }

    @asyncAction
    public *unlockWallet(password: string, name: string) {
        const { validation, data: success } = yield Api.unlockWallet(
            password,
            name,
        );
        this.state.success = success;
        this.state.validation = validation;
    }
}
