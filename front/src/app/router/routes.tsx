import * as React from 'react';

import { Send } from 'app/components/layouts/send';
import { Wallets } from 'app/components/layouts/account-list';
import { App } from 'app/components/layouts/app';
import { History } from 'app/components/layouts/history';
import { SendSuccess } from 'app/components/layouts/send/sub/success';
import { SendConfirm } from 'app/components/layouts/send/sub/confirm';
import { Account } from 'app/components/layouts/account';
import { Profile } from 'app/components/layouts/profile';
import { ProfileList } from 'app/components/layouts/profile-list';
import { DepositWithdrawHistory } from 'app/components/layouts/deposit-withdraw-history';
import { Deposit, Withdraw } from 'app/components/layouts/deposit-withdraw';
import { DepositWithdrawSuccess } from 'app/components/layouts/deposit-withdraw/sub/success';
import { OrderList } from 'app/components/layouts/order-list';
import { DealList } from 'app/components/layouts/deal-list';
import { Deal } from 'app/components/layouts/deal';
import { OrderDetails } from 'app/components/layouts/order-details';
import { OrderCompleteBuy } from 'app/components/layouts/order-complete-buy';

import {
    IRouterResult,
    IContext,
    IUniversalRouterItem,
    IUrlParams,
} from './types';
import { reload, firstByDefault, replaceWithChild } from './utils';
import { loader, DataLoader, IDataLoader } from './loader';

import { navigate, INavigateArgument } from './navigate';
import { IOrder } from '../api/types';

let defaultAction;

export class Navigation {
    private readonly l: DataLoader;
    private readonly n: (params: INavigateArgument) => void;

    public constructor(l: IDataLoader, n: (params: INavigateArgument) => void) {
        this.l = l;
        this.n = n;
    }

    public toSend = () => this.n({ path: '/wallet/send' });
    public toHistory = (
        accountAddress: string = '',
        currencyAddress: string = '',
    ) => {
        this.l.loadHistory(accountAddress, currencyAddress);
        this.n({ path: '/wallet/history' });
    };
    public toConfirmation = () => this.n({ path: '/wallet/send/confirm' });
    public toSuccess = () => this.n({ path: '/wallet/send/success' });
    public toMain = () => this.n({ path: '/wallet/accounts' });
    public to = (path: string) => this.n({ path });
    public toProfile = (address: string) =>
        this.n({ path: `/market/profiles/${address}` });
    public toDeal = (id: string) => this.n({ path: `/market/deals/${id}` });
    public toDealList = () => this.n({ path: `/market/deals/` });
    public toDepositSuccess = () =>
        this.n({ path: `/market/dw/deposit/success` });
    public toDepositConfirm = () =>
        this.n({ path: `/market/dw/deposit/confirm` });
    public toWithdrawSuccess = () =>
        this.n({ path: `/market/dw/withdraw/success` });
    public toWithdrawConfirm = () =>
        this.n({ path: `/market/dw/withdraw/confirm` });
    public toDWHistory = () => this.n({ path: '/market/dw/history' });
    public toDeposit = () => this.n({ path: '/market/dw/deposit' });
    public toWithdraw = () => this.n({ path: '/market/dw/withdraw' });
    public toOrdersByAddress = (creatorAddress: string) => {
        this.l.loadOrderList({ creatorAddress });
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
        this.l.loadOrderList(Object.prototype);
        this.n({ path: '/market/orders' });
    };
}

export type INavigation = { [P in keyof Navigation]: Navigation[P] }; // i am to lazy, sorry

const navigation: INavigation = new Navigation(loader, navigate);

export const createRoutes = (
    l: DataLoader,
    n: INavigation,
): Array<IUniversalRouterItem> => [
    {
        path: '/',
        action: async (ctx: IContext, _: IUrlParams) => {
            const params: IRouterResult = await ctx.next();

            const breadcrumbs = ctx.breadcrumbs;

            ctx.breadcrumbs = [];

            return {
                content: (
                    <App
                        className={
                            params.props ? params.props.className : undefined
                        }
                        breadcrumbs={breadcrumbs}
                        onNavigate={navigation.to}
                        onExit={reload}
                        path={ctx.pathname}
                        title={params.pageTitle}
                        {...params.props}
                    >
                        {params.content}
                    </App>
                ),
                browserTabTitle: params.browserTabTitle || '_SONM_',
            };
        },
        children: [
            {
                path: '/wallet',
                breadcrumbTitle: 'Wallet',
                action: firstByDefault,
                children: [
                    {
                        path: '/send',
                        breadcrumbTitle: 'Send',
                        action: replaceWithChild(
                            async (ctx: IContext, params: IUrlParams) => ({
                                browserTabTitle: 'Send',
                                pageTitle: 'Send',
                                content: (
                                    <Send
                                        onNotAvailable={n.toMain}
                                        initialAddress={ctx.query.address}
                                        initialCurrency={ctx.query.currency}
                                        onRequireConfirmation={n.toConfirmation}
                                    />
                                ),
                            }),
                        ),
                        children: [
                            {
                                path: '/confirm',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    browserTabTitle: 'Transfer confirmation',
                                    pageTitle: 'Transfer confirmation',
                                    content: (
                                        <SendConfirm
                                            onBack={n.toSend}
                                            onSuccess={n.toSuccess}
                                        />
                                    ),
                                }),
                            },
                            {
                                path: '/success',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    browserTabTitle:
                                        'Transaction has been sent',
                                    pageTitle: 'Transaction has been sent',
                                    content: (
                                        <SendSuccess
                                            onClickHistory={n.toHistory}
                                            onClickSend={n.toSend}
                                        />
                                    ),
                                }),
                            },
                        ],
                    },
                    {
                        path: '/history',
                        breadcrumbTitle: 'History',
                        action: async (ctx: IContext, params: IUrlParams) => {
                            l.loadHistory(
                                ctx.query.address,
                                ctx.query.currency,
                            );

                            return {
                                browserTabTitle: 'History',
                                pageTitle: 'History',
                                content: <History />,
                            };
                        },
                    },
                    {
                        path: '/accounts',
                        breadcrumbTitle: 'Accounts',
                        action: (defaultAction = replaceWithChild(
                            async (ctx: IContext, params: IUrlParams) => ({
                                browserTabTitle: 'Accounts',
                                pageTitle: 'Accounts',
                                content: <Wallets />,
                            }),
                        )),
                        children: [
                            {
                                breadcrumbTitle: 'Accounts details',
                                path: '/:address',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: (
                                        <Account
                                            initialAddress={params.address}
                                        />
                                    ),
                                    browserTabTitle: 'Account',
                                    pageTitle: 'Account',
                                }),
                            },
                        ],
                    },
                ],
            },
            {
                path: '/market',
                breadcrumbTitle: 'market',
                action: firstByDefault,
                children: [
                    {
                        path: '/profiles',
                        breadcrumbTitle: 'Profiles',
                        action: replaceWithChild(
                            async (ctx: IContext, params: IUrlParams) => ({
                                pathKey: '/profiles',
                                browserTabTitle: 'Profiles',
                                pageTitle: 'Profiles',
                                content: (
                                    <ProfileList onNavigate={n.toProfile} />
                                ),
                            }),
                        ),
                        children: [
                            {
                                breadcrumbTitle: 'Profile details',
                                path: '/:address',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: (
                                        <Profile
                                            address={params.address}
                                            onNavigateToOrders={
                                                n.toOrdersByAddress
                                            }
                                        />
                                    ),
                                    browserTabTitle: 'Profile',
                                    pageTitle: 'Profile',
                                }),
                            },
                        ],
                    },
                    {
                        path: '/dw',
                        action: firstByDefault,
                        children: [
                            {
                                path: '/deposit',
                                action: replaceWithChild(
                                    async (
                                        ctx: IContext,
                                        params: IUrlParams,
                                    ) => ({
                                        content: (
                                            <Deposit
                                                isConfirmation={false}
                                                onNotAvailable={
                                                    navigation.toMain
                                                }
                                                onSuccess={n.toDepositSuccess}
                                                onConfirm={n.toDepositConfirm}
                                                onBack={n.toDepositSuccess}
                                            />
                                        ),
                                        browserTabTitle: 'Deposit',
                                        pageTitle: 'Deposit',
                                    }),
                                ),
                                children: [
                                    {
                                        breadcrumbTitle: 'Deposit confirmation',
                                        path: '/confirm',
                                        action: async (
                                            ctx: IContext,
                                            params: IUrlParams,
                                        ) => ({
                                            content: (
                                                <Deposit
                                                    isConfirmation={true}
                                                    onNotAvailable={n.toMain}
                                                    onSuccess={
                                                        n.toDepositSuccess
                                                    }
                                                    onConfirm={
                                                        n.toDepositConfirm
                                                    }
                                                    onBack={
                                                        navigation.toDeposit
                                                    }
                                                />
                                            ),
                                            browserTabTitle: 'Deposit',
                                            pageTitle: 'Deposit',
                                            props: {
                                                className:
                                                    'sonm-app--confirmation-bg',
                                            },
                                        }),
                                    },
                                    {
                                        breadcrumbTitle: '',
                                        path: '/success',
                                        action: (ctx: IContext) => ({
                                            title: 'Success',
                                            content: (
                                                <DepositWithdrawSuccess
                                                    onClickHistory={
                                                        n.toDWHistory
                                                    }
                                                    onClickDeposit={n.toDeposit}
                                                    onClickWithdraw={
                                                        n.toWithdraw
                                                    }
                                                />
                                            ),
                                            browserTabTitle: 'Deposit',
                                            pageTitle: 'Deposit',
                                        }),
                                    },
                                ],
                            },
                            {
                                path: '/withdraw',
                                action: replaceWithChild(
                                    async (
                                        ctx: IContext,
                                        params: IUrlParams,
                                    ) => ({
                                        content: (
                                            <Withdraw
                                                isConfirmation={false}
                                                onNotAvailable={
                                                    navigation.toMain
                                                }
                                                onSuccess={n.toWithdrawSuccess}
                                                onConfirm={n.toWithdrawConfirm}
                                                onBack={n.toWithdrawSuccess}
                                            />
                                        ),
                                        browserTabTitle: 'Withdraw',
                                        pageTitle: 'Withdraw',
                                    }),
                                ),
                                children: [
                                    {
                                        breadcrumbTitle:
                                            'Withdraw confirmation',
                                        path: '/confirm',
                                        action: async (
                                            ctx: IContext,
                                            params: IUrlParams,
                                        ) => ({
                                            content: (
                                                <Withdraw
                                                    isConfirmation={true}
                                                    onNotAvailable={n.toMain}
                                                    onSuccess={
                                                        n.toWithdrawSuccess
                                                    }
                                                    onConfirm={
                                                        n.toWithdrawConfirm
                                                    }
                                                    onBack={n.toWithdraw}
                                                />
                                            ),
                                            browserTabTitle: 'Withdraw',
                                            pageTitle: 'Withdraw',
                                            props: {
                                                className:
                                                    'sonm-app--confirmation-bg',
                                            },
                                        }),
                                    },
                                    {
                                        breadcrumbTitle: '',
                                        path: '/success',
                                        action: (ctx: IContext) => ({
                                            title: 'Success',
                                            content: (
                                                <DepositWithdrawSuccess
                                                    onClickHistory={
                                                        n.toDWHistory
                                                    }
                                                    onClickDeposit={n.toDeposit}
                                                    onClickWithdraw={
                                                        n.toWithdraw
                                                    }
                                                />
                                            ),
                                            browserTabTitle: 'Withdraw',
                                            pageTitle: 'Withdraw',
                                        }),
                                    },
                                ],
                            },
                            {
                                path: '/history',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: (
                                        <DepositWithdrawHistory
                                            onClickDeposit={n.toDeposit}
                                            onClickWithdraw={n.toWithdraw}
                                        />
                                    ),
                                    browserTabTitle: 'D & W History',
                                    pageTitle: 'D & W History',
                                }),
                            },
                        ],
                    },
                    {
                        path: '/orders',
                        breadcrumbTitle: 'Orders',
                        action: replaceWithChild(
                            async (ctx: IContext, params: IUrlParams) => ({
                                browserTabTitle: 'Market orders',
                                pageTitle: 'Market orders',
                                content: (
                                    <OrderList onNavigateToOrder={n.toOrder} />
                                ),
                            }),
                        ),
                        children: [
                            {
                                breadcrumbTitle: '',
                                path: '/complete-buy',
                                action: async (ctx: IContext) => {
                                    return {
                                        content: (
                                            <OrderCompleteBuy
                                                onClickDeals={n.toDealList}
                                                onClickMarket={
                                                    n.toSimilarOrders
                                                }
                                                onClickOrders={
                                                    navigation.toFullOrderList
                                                }
                                            />
                                        ),
                                        browserTabTitle: 'Order buy success',
                                        pageTitle: '',
                                    };
                                },
                            },
                            {
                                breadcrumbTitle: 'Order details',
                                path: '/:orderId',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => {
                                    loader.loadOrder(params.orderId);

                                    return {
                                        browserTabTitle: 'Order details',
                                        pageTitle: 'Order details',
                                        content: (
                                            <OrderDetails
                                                onCompleteBuyingOrder={
                                                    n.toCompleteBuyingOrder
                                                }
                                            />
                                        ),
                                    };
                                },
                            },
                        ],
                    },
                    {
                        path: '/deals/:id',
                        breadcrumbTitle: 'Deals',
                        action: async (ctx: IContext, params: IUrlParams) => ({
                            browserTabTitle: 'Deal details',
                            pageTitle: 'Deal details',
                            content: (
                                <Deal
                                    id={params.id}
                                    onNavigateToDeals={n.toDealList}
                                />
                            ),
                        }),
                    },
                    {
                        path: '/deals',
                        breadcrumbTitle: 'Deals',
                        action: async (ctx: IContext, params: IUrlParams) => ({
                            browserTabTitle: 'Deals',
                            pageTitle: 'Deals',
                            content: <DealList onNavigate={n.toDeal} />,
                        }),
                    },
                ],
            },
            {
                path: /.*/,
                action: defaultAction,
            },
        ],
    },
];

export default (univeralRoutes = createRoutes(loader, navigation));
