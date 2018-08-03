import { observable, computed, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { OnlineStore, IOnlineStoreServices } from './online-store';
import Api, { IWalletListItem } from 'app/api';
const { pending } = OnlineStore;

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
}
