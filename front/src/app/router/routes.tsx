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

import * as React from 'react';

import { navigate } from './navigate';

let defaultAction;

const navigateToSend = () => navigate({ path: '/send' });
const navigateToHistory = (
    accountAddress: string = '',
    currencyAddress: string = '',
) => {
    navigate({
        path: '/history',
        query:
            accountAddress || currencyAddress
                ? {
                      address: accountAddress,
                      currency: currencyAddress,
                  }
                : undefined,
    });
};
const navigateToConfirmation = () => navigate({ path: '/send/confirm' });
const navigateToSuccess = () => navigate({ path: '/send/success' });
const navigateToMain = () => navigate({ path: '/accounts' });
const navigateTo = (path: string) => navigate({ path });
const navigateToProfile = (address: string) =>
    navigate({ path: `/market/profiles/${address}` });

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

function reload() {
    window.location.reload(true);
}

function replaceWithChild(action: TFnAction): TFnAction {
    return async (ctx: IContext, p: any): Promise<IRouterResult> => {
        const child: IRouterResult = await ctx.next();

        if (child) {
            return child;
        } else {
            return action(ctx, p);
        }
    };
}

async function firstByDefault(ctx: IContext, p: any) {
    const params: IRouterResult = await ctx.next();

    return params ? params : ctx.route.children[0].action(ctx, p);
}

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
                        breadcrumbs={breadcrumbs}
                        onNavigate={navigateTo}
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
                                    browserTabTitle: 'Transfer success',
                                    pageTitle: 'Transfer success',
                                    content: (
                                        <SendSuccess
                                            onClickHistory={navigateToHistory}
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
                            content: (
                                <History
                                    initialAddress={ctx.query.address}
                                    initialCurrency={ctx.query.currency}
                                />
                            ),
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
                breadcrumbTitle: 'Market',
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
                                        <Profile address={params.address} />
                                    ),
                                    browserTabTitle: 'Profiles',
                                    pageTitle: 'Profiles',
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
                ],
            },
            {
                path: /.*/,
                action: defaultAction,
            },
        ],
    },
];

export interface IUrlParams {
    [key: string]: string;
}

export interface IContext {
    query: any;
    route: any;
    pathname: string;
    params?: IRouterResult;
    next: () => IRouterResult;
    breadcrumbs: Array<IBreadcrumb>;
}

type TFnAction = (ctx: IContext, params: any) => Promise<IRouterResult>;

export interface IBreadcrumb {
    path: string;
    title: string;
}

interface IUniversalRouterItem {
    path: string | RegExp;
    action?: TFnAction;
    children?: Array<IUniversalRouterItem>;
    breadcrumbTitle?: string;
}

interface IRouterResult {
    content?: React.ReactNode;
    browserTabTitle?: string;
    pageTitle?: string;
    props?: any;
    pathKey?: string;
}

export default univeralRoutes;
