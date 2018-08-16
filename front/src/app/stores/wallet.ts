import { observable, computed, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import Api from 'app/api';
import { Wallet, defaultWallet } from 'app/entities/wallet';
const { pending } = OnlineStore;

export class WalletStore extends OnlineStore {
    constructor(services: IOnlineStoreServices) {
        super(services);
    }

    @action
    public init(wallet: Wallet) {
        this.walletInfo = wallet;
    }

    @observable.ref protected walletInfo: Wallet = defaultWallet;

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

    @computed
    public get isLivenet() {
        return this.walletInfo.isLivenet;
    }

    @computed
    public get ethNodeUrl() {
        return this.walletInfo.ethNodeUrl;
    }

    @computed
    public get sidechainNodeUrl() {
        return this.walletInfo.sidechainNodeUrl;
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
}
