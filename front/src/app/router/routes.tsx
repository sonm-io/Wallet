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
import { KycList } from 'app/components/layouts/kyc-list';

import {
    IRouterResult,
    IContext,
    IUniversalRouterItem,
    IUrlParams,
    IDataLoader,
    INavigator,
} from './types';

import { reload, firstByDefault, replaceWithChild } from './utils';
import { navigateBack } from './navigate';

let defaultAction;

export const createRoutes = (
    l: IDataLoader,
    n: INavigator,
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
                        disableAccountSelect={
                            params.props
                                ? params.props.disableAccountSelect
                                : undefined
                        }
                        navigateToProfile={n.toProfile}
                        breadcrumbs={breadcrumbs}
                        onExit={reload}
                        path={ctx.pathname}
                        title={params.pageTitle}
                        navigator={n}
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
                                        onRequireConfirmation={n.toConfirmation}
                                    />
                                ),
                            }),
                        ),
                        children: [
                            {
                                path: '/:currency',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    browserTabTitle: 'Transfer confirmation',
                                    pageTitle: 'Transfer confirmation',
                                    content: (
                                        <Send
                                            onNotAvailable={n.toMain}
                                            initialCurrency={params.currency}
                                            onRequireConfirmation={
                                                n.toConfirmation
                                            }
                                        />
                                    ),
                                }),
                            },
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
                                            onClickHistory={n.toWalletHistory}
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
                            l.loadWalletHistory();

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
                                content: (
                                    <Wallets navigateToProfile={n.toProfile} />
                                ),
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
                                            onClickHistory={n.toWalletHistory}
                                            onClickSend={n.toSend}
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
                            async (ctx: IContext, params: IUrlParams) => {
                                l.loadProfileList();

                                return {
                                    pathKey: '/profiles',
                                    browserTabTitle: 'Profiles',
                                    pageTitle: 'Profiles',
                                    content: (
                                        <ProfileList onNavigate={n.toProfile} />
                                    ),
                                };
                            },
                        ),
                        children: [
                            {
                                breadcrumbTitle: 'Profile details',
                                path: '/:address',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => {
                                    l.loadProfileDetails(params.address);

                                    return {
                                        content: (
                                            <Profile
                                                onNavigateToOrders={
                                                    n.toOrderListByAddress
                                                }
                                                onNavigateToKyc={n.toKyc}
                                            />
                                        ),
                                        browserTabTitle: 'Profile',
                                        pageTitle: 'Profile',
                                    };
                                },
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
                                                onNotAvailable={n.toMain}
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
                                                    onBack={n.toDeposit}
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
                                                        n.toDwHistory
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
                                                onNotAvailable={n.toMain}
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
                                                        n.toDwHistory
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
                                ) => {
                                    l.loadDwhHistory();

                                    return {
                                        content: (
                                            <DepositWithdrawHistory
                                                onClickDeposit={n.toDeposit}
                                                onClickWithdraw={n.toWithdraw}
                                            />
                                        ),
                                        browserTabTitle: 'D & W History',
                                        pageTitle: 'D & W History',
                                    };
                                },
                            },
                        ],
                    },
                    {
                        path: '/orders',
                        breadcrumbTitle: 'Orders',
                        action: replaceWithChild(
                            async (ctx: IContext, params: IUrlParams) => {
                                l.loadOrderList();

                                return {
                                    browserTabTitle: 'Market orders',
                                    pageTitle: 'Market orders',
                                    content: (
                                        <OrderList
                                            onNavigateToOrder={n.toOrder}
                                        />
                                    ),
                                };
                            },
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
                                                    n.toOrderListByAddress
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
                                    l.loadOrder(params.orderId);

                                    return {
                                        browserTabTitle: 'Order details',
                                        pageTitle: 'Order details',
                                        content: (
                                            <OrderDetails
                                                onCompleteBuyingOrder={
                                                    n.toCompleteBuyingOrder
                                                }
                                                onNavigateBack={navigateBack}
                                                onNavigateDeposit={n.toDeposit}
                                            />
                                        ),
                                    };
                                },
                            },
                        ],
                    },
                    {
                        path: '/deals/:dealId',
                        breadcrumbTitle: 'Deals',
                        action: async (ctx: IContext, params: IUrlParams) => {
                            l.loadDeal(params.dealId);

                            return {
                                browserTabTitle: 'Deal details',
                                pageTitle: 'Deal details',
                                content: (
                                    <Deal onNavigateToDeals={n.toDealList} />
                                ),
                            };
                        },
                    },
                    {
                        path: '/deals',
                        breadcrumbTitle: 'Deals',
                        action: async (ctx: IContext, params: IUrlParams) => {
                            l.loadDealList();

                            return {
                                browserTabTitle: 'Deals',
                                pageTitle: 'Deals',
                                content: (
                                    <DealList
                                        onClickDeal={n.toDeal}
                                        onClickViewMarket={n.toOrders}
                                    />
                                ),
                            };
                        },
                    },
                    {
                        path: '/workers',
                        breadcrumbTitle: 'Workers',
                        action: async (ctx: IContext, params: IUrlParams) => {
                            l.loadWorkerList();

                            return {
                                browserTabTitle: 'Workers',
                                pageTitle: 'Workers',
                                content: <WorkerList />,
                            };
                        },
                    },
                    {
                        path: '/kyc',
                        breadcrumbTitle: 'KYC providers',
                        action: async (ctx: IContext, params: IUrlParams) => {
                            l.loadKycList();

                            return {
                                browserTabTitle: 'KYC providers',
                                pageTitle: 'KYC providers',
                                content: (
                                    <KycList onNavigateDeposit={n.toDeposit} />
                                ),
                            };
                        },
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
