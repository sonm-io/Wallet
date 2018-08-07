import { observable, computed, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import Api, { IWalletListItem, IValidation } from 'app/api';
const { pending } = OnlineStore;

interface ILoginState {
    success: boolean;
    validation?: IValidation;
}

export class WalletStore extends OnlineStore {
    constructor(services: IOnlineStoreServices) {
        super(services);
    }

    @action
    public init(wallet: IWalletListItem) {
        this.walletInfo = wallet;
    }

    @observable.ref protected walletInfo?: IWalletListItem;

    @computed
    public get walletName(): string {
        return this.walletInfo ? this.walletInfo.name : '';
    }

    @computed
    public get networkName(): string {
        return (this.walletInfo ? this.walletInfo.chainId : '').toLowerCase();
    }

    @computed
    public get nodeUrl(): string {
        return this.walletInfo ? this.walletInfo.nodeUrl : '';
    }

    @pending
    @asyncAction
    protected *exportWallet() {
        const { data: text } = yield Api.exportWallet();

        return text;
    }

    public getWalletExportText = async () => {
        const text = await this.exportWallet();

        return String(text);
    };

    @observable
    private loginState: ILoginState = {
        success: false,
    };

    @computed
    public get isLoginSuccess(): boolean {
        return this.loginState.success;
    }

    @computed
    public get loginValidation(): IValidation | undefined {
        return this.loginState.validation;
    }

    @asyncAction
    public *unlockWallet(password: string, name: string) {
        const { validation, data: success } = yield Api.unlockWallet(
            password,
            name,
        );
        this.loginState.success = success;
        this.loginState.validation = validation;
    }
}
