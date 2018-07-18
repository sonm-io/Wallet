import { INavigator, IDataLoader } from './types';
import { INavigateArgument } from './navigate';
import { IOrder } from '../api/types';
import { TEthereumAddress } from '../entities/types';

export class Navigator implements INavigator {
    private readonly l: IDataLoader;
    private readonly n: (params: INavigateArgument) => void;

    public constructor(
        loader: IDataLoader,
        navigateFn: (params: INavigateArgument) => void,
    ) {
        this.l = loader;
        this.n = navigateFn;
    }

    public toSend = (address?: string) =>
        this.n({ path: `/wallet/send/${address}` });
    public toHistory = () => {
        this.n({ path: '/wallet/history' });
    };
    public toConfirmation = () => this.n({ path: '/wallet/send/confirm' });
    public toSuccess = () => this.n({ path: '/wallet/send/success' });
    public toMain = () => this.n({ path: '/wallet/accounts' });
    public to = (path: string) => this.n({ path });
    public toProfile = (address: string) =>
        this.n({ path: `/market/profiles/${address}` });
    public toDeal = (id: string) => this.n({ path: `/market/deals/${id}` });
    public toDealChangeRequest = (id: string) =>
        this.n({ path: `/market/deals/${id}/change` });
    public toDealList = () => this.n({ path: `/market/deals/` });
    public toDepositSuccess = () =>
        this.n({ path: `/market/dw/deposit/success` });
    public toDepositConfirm = () =>
        this.n({ path: `/market/dw/deposit/confirm` });
    public toWithdrawSuccess = () =>
        this.n({ path: `/market/dw/withdraw/success` });
    public toWithdrawConfirm = () =>
        this.n({ path: `/market/dw/withdraw/confirm` });
    public toDwHistory = () => this.n({ path: '/market/dw/history' });
    public toWalletHistory = () => {
        this.n({ path: '/wallet/history' });
    };
    public toWalletHistoryByParams = (
        account: TEthereumAddress,
        currency: TEthereumAddress,
    ) => {
        this.l.loadWalletHistoryByParams(account, currency);
        this.n({ path: '/wallet/history' });
    };
    public toDeposit = () => this.n({ path: '/market/dw/deposit' });
    public toWithdraw = () => this.n({ path: '/market/dw/withdraw' });
    public toOrderListByAddress = (creatorAddress?: string) => {
        this.l.loadOrderListByParams({ creatorAddress });
        this.n({ path: '/market/orders' });
    };
    public toOrder = (orderId: string) =>
        this.n({ path: `/market/orders/${orderId}` });
    public toCompleteBuyingOrder = () =>
        this.n({ path: '/market/orders/complete-buy' });
    public toSimilarOrders = (orderId: IOrder) => {
        this.l.loadOrderListByOrder(orderId);
        this.n({ path: '/market/orders' });
    };
    public toFullOrderList = () => {
        this.l.loadFullOrderList();
        this.n({ path: '/market/orders' });
    };
    public toKyc = () => {
        this.n({ path: '/market/kyc' });
    };
    public toOrders = () => {
        this.n({ path: '/market/orders' });
    };
    public toDeals = () => {
        this.n({ path: '/market/deals' });
    };
    public toWorkers = () => {
        this.n({ path: '/market/workers' });
    };
}
