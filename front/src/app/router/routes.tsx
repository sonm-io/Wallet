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
import { WorkerList } from 'app/components/layouts/worker-list';
import { Deal } from 'app/components/layouts/deal';
import { OrderDetails } from 'app/components/layouts/order-details';
import { OrderCompleteBuy } from 'app/components/layouts/order-complete-buy';
import { TMenuItem } from 'app/components/layouts/app/sub/nav-menu-dropdown';

import {
    IRouterResult,
    IContext,
    IUniversalRouterItem,
    IUrlParams,
} from './types';
import { reload, firstByDefault, replaceWithChild } from './utils';
import { loader } from './loader';

import { navigate } from './navigate';
import { IOrder } from '../api/types';
import { rootStore } from '../stores';

let defaultAction;

const navigateTo = (path: string) => navigate({ path });

const navigateToSend = () => navigate({ path: '/wallet/send' });
const navigateToWalletHistory = (accountAddress?: string) => {
    loader.loadWalletHistory(accountAddress);
    navigate({ path: '/wallet/history' });
};
const navigateToConfirmation = () => navigate({ path: '/wallet/send/confirm' });
const navigateToSuccess = () => navigate({ path: '/wallet/send/success' });
const navigateToMain = () => navigate({ path: '/wallet/accounts' });
const navigateToProfile = (address: string) =>
    navigate({ path: `/market/profiles/${address}` });
const navigateToDeal = (id: string) =>
    navigate({ path: `/market/deals/${id}` });
const navigateToDealList = () => navigate({ path: `/market/deals/` });
const navigateToDepositSuccess = () =>
    navigate({ path: `/market/dw/deposit/success` });
const navigateToDepositConfirm = () =>
    navigate({ path: `/market/dw/deposit/confirm` });
const navigateToWithdrawSuccess = () =>
    navigate({ path: `/market/dw/withdraw/success` });
const navigateToWithdrawConfirm = () =>
    navigate({ path: `/market/dw/withdraw/confirm` });
const navigateToDWHistory = () => navigate({ path: '/market/dw/history' });
const navigateToDeposit = () => navigate({ path: '/market/dw/deposit' });
const navigateToWithdraw = () => navigate({ path: '/market/dw/withdraw' });
const navigateToOrdersByAddress = (creatorAddress: string) => {
    loader.loadOrderList({ creatorAddress });
    navigateTo('/market/orders');
};
const navigateToOrders = () => {
    loader.loadOrderList({});
    navigateTo('/market/orders');
};
const navigateToOrder = (orderId: string) =>
    navigate({ path: `/market/orders/${orderId}` });
const navigateToCompleteBuyingOrder = () =>
    navigate({ path: '/market/orders/complete-buy' });
const navigateToSimilarOrders = (orderId: IOrder) => {
    loader.loadOrderListByOrder(orderId);
    navigate({ path: '/market/orders' });
};
const navigateToWorkerList = () => {
    navigate({ path: '/market/workers' });
};
const navigateToFullOrderList = () => {
    loader.loadOrderList(Object.prototype);
    navigate({ path: '/market/orders' });
};

const headerMenu: Array<TMenuItem> = [
    [
        'Wallet',
        undefined,
        [
            ['Accounts', () => navigateTo('/wallet/accounts')],
            ['History', navigateToWalletHistory],
            ['Send', () => navigateTo('/wallet/send')],
        ],
    ],
    [
        'Market',
        undefined,
        [
            ['Profiles', () => navigateTo('/market/profiles')],
            ['Orders', navigateToOrders],
            ['Deals', navigateToDealList],
            ['Deposit', navigateToDeposit],
            ['Withdraw', navigateToWithdraw],
            ['History', navigateToDWHistory],
            ['Workers', Boolean, navigateToWorkerList, undefined],
        ],
        () => rootStore.marketStore.marketAccountViewList.length === 0, // is disabled
    ],
] as Array<TMenuItem>; // Force cast, cause 2 last parameter can be undefined

export const univeralRoutes: Array<IUniversalRouterItem> = [
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
                        disableAccountSelect={
                            params.props
                                ? params.props.disableAccountSelect
                                : undefined
                        }
                        breadcrumbs={breadcrumbs}
                        onExit={reload}
                        path={ctx.pathname}
                        title={params.pageTitle}
                        headerMenu={headerMenu}
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
                                        onNotAvailable={navigateToMain}
                                        initialAddress={ctx.query.address}
                                        initialCurrency={ctx.query.currency}
                                        onRequireConfirmation={
                                            navigateToConfirmation
                                        }
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
                                            onBack={navigateToSend}
                                            onSuccess={navigateToSuccess}
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
                                            onClickHistory={
                                                navigateToWalletHistory
                                            }
                                            onClickSend={navigateToSend}
                                        />
                                    ),
                                }),
                            },
                        ],
                    },
                    {
                        path: '/history',
                        breadcrumbTitle: 'History',
                        action: async (ctx: IContext, params: IUrlParams) => ({
                            browserTabTitle: 'History',
                            pageTitle: 'History',
                            content: <History />,
                        }),
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
                                            onClickHistory={
                                                navigateToWalletHistory
                                            }
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
                                    <ProfileList
                                        onNavigate={navigateToProfile}
                                    />
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
                                                navigateToOrdersByAddress
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
                                                onNotAvailable={navigateToMain}
                                                onSuccess={
                                                    navigateToDepositSuccess
                                                }
                                                onConfirm={
                                                    navigateToDepositConfirm
                                                }
                                                onBack={
                                                    navigateToDepositSuccess
                                                }
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
                                                    onNotAvailable={
                                                        navigateToMain
                                                    }
                                                    onSuccess={
                                                        navigateToDepositSuccess
                                                    }
                                                    onConfirm={
                                                        navigateToDepositConfirm
                                                    }
                                                    onBack={navigateToDeposit}
                                                />
                                            ),
                                            browserTabTitle: 'Deposit',
                                            pageTitle: 'Deposit',
                                            props: {
                                                className:
                                                    'sonm-app--confirmation-bg',
                                                disableAccountSelect: true,
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
                                                        navigateToDWHistory
                                                    }
                                                    onClickDeposit={
                                                        navigateToDeposit
                                                    }
                                                    onClickWithdraw={
                                                        navigateToWithdraw
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
                                                onNotAvailable={navigateToMain}
                                                onSuccess={
                                                    navigateToWithdrawSuccess
                                                }
                                                onConfirm={
                                                    navigateToWithdrawConfirm
                                                }
                                                onBack={
                                                    navigateToWithdrawSuccess
                                                }
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
                                                    onNotAvailable={
                                                        navigateToMain
                                                    }
                                                    onSuccess={
                                                        navigateToWithdrawSuccess
                                                    }
                                                    onConfirm={
                                                        navigateToWithdrawConfirm
                                                    }
                                                    onBack={navigateToWithdraw}
                                                />
                                            ),
                                            browserTabTitle: 'Withdraw',
                                            pageTitle: 'Withdraw',
                                            props: {
                                                className:
                                                    'sonm-app--confirmation-bg',
                                                disableAccountSelect: true,
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
                                                        navigateToDWHistory
                                                    }
                                                    onClickDeposit={
                                                        navigateToDeposit
                                                    }
                                                    onClickWithdraw={
                                                        navigateToWithdraw
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
                                            onClickDeposit={navigateToDeposit}
                                            onClickWithdraw={navigateToWithdraw}
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
                                    <OrderList
                                        onNavigateToOrder={navigateToOrder}
                                    />
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
                                                onClickDeals={
                                                    navigateToDealList
                                                }
                                                onClickMarket={
                                                    navigateToSimilarOrders
                                                }
                                                onClickOrders={
                                                    navigateToFullOrderList
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
                                                    navigateToCompleteBuyingOrder
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
                                    onNavigateToDeals={navigateToDealList}
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
                            content: <DealList onNavigate={navigateToDeal} />,
                        }),
                    },
                    {
                        path: '/workers',
                        breadcrumbTitle: 'Workers',
                        action: async (ctx: IContext, params: IUrlParams) => ({
                            browserTabTitle: 'Workers',
                            pageTitle: 'Workers',
                            content: <WorkerList />,
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

export default univeralRoutes;
