import { Send } from 'app/components/layouts/send';
import { Wallets } from 'app/components/layouts/account-list';
import { App } from 'app/components/layouts/app';
import { History } from 'app/components/layouts/history';
import { SendSuccess } from 'app/components/layouts/send/sub/success';
import { SendConfirm } from 'app/components/layouts/send/sub/confirm';
import { Account } from 'app/components/layouts/account';
import { Profile } from 'app/components/layouts/profile';
import { ProfileList } from 'app/components/layouts/profile-list';
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

function reload() {
    window.location.reload(true);
}

async function replaceWithChild(
    me: IRouterResult,
    ctx: IContext,
): Promise<IRouterResult> {
    const params: IRouterResult = await ctx.next();

    if (params) {
        return params;
    }

    return me;
}

async function firstByDefault(ctx: IContext, p: any) {
    const params: IRouterResult = await ctx.next();

    return params ? params : ctx.route.children[0].action(ctx, p);
}

export const univeralRouterArgument: Array<IUniversalRouterItem> = [
    {
        path: '/',
        action: async (ctx: IContext, _: IUrlParams) => {
            const params: IRouterResult = await ctx.next();

            return {
                content: (
                    <App
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
                action: firstByDefault,
                children: [
                    {
                        path: '/send',
                        action: async (ctx: IContext, params: IUrlParams) =>
                            replaceWithChild(
                                {
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
                                },
                                ctx,
                            ),
                        children: [
                            {
                                path: '/confirm',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) =>
                                    replaceWithChild(
                                        {
                                            browserTabTitle:
                                                'Transfer confirmation',
                                            pageTitle: 'Transfer confirmation',
                                            content: (
                                                <SendConfirm
                                                    onBack={navigateToSend}
                                                    onSuccess={
                                                        navigateToSuccess
                                                    }
                                                />
                                            ),
                                        },
                                        ctx,
                                    ),
                            },
                            {
                                path: '/success',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) =>
                                    replaceWithChild(
                                        {
                                            browserTabTitle: 'Transfer success',
                                            pageTitle: 'Transfer success',
                                            content: (
                                                <SendSuccess
                                                    onClickHistory={
                                                        navigateToHistory
                                                    }
                                                    onClickSend={navigateToSend}
                                                />
                                            ),
                                        },
                                        ctx,
                                    ),
                            },
                        ],
                    },
                    {
                        path: '/history',
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
                        action: (defaultAction = async (
                            ctx: IContext,
                            params: IUrlParams,
                        ) =>
                            replaceWithChild(
                                {
                                    browserTabTitle: 'Accounts',
                                    pageTitle: 'Accounts',
                                    content: <Wallets />,
                                },
                                ctx,
                            )),
                        children: [
                            {
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
                                    browserTabTitle: 'Accounts',
                                    pageTitle: 'Accounts',
                                }),
                            },
                        ],
                    },
                ],
            },
            {
                path: '/market',
                action: firstByDefault,
                children: [
                    {
                        path: '/profiles',
                        action: async (ctx: IContext) =>
                            replaceWithChild(
                                {
                                    pathKey: '/profiles',
                                    browserTabTitle: 'Profiles',
                                    pageTitle: 'Profiles',
                                    content: <ProfileList />,
                                },
                                ctx,
                            ),
                        children: [
                            {
                                path: '/:address',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: <Profile />,
                                    browserTabTitle: 'Accounts',
                                    pageTitle: 'Accounts',
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
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: 'Deposit',
                                    browserTabTitle: 'Deposit',
                                    pageTitle: 'Deposit',
                                }),
                            },
                            {
                                path: '/withdraw',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: 'Withdraw',
                                    browserTabTitle: 'Withdraw',
                                    pageTitle: 'Withdraw',
                                }),
                            },
                            {
                                path: '/history',
                                action: async (
                                    ctx: IContext,
                                    params: IUrlParams,
                                ) => ({
                                    content: 'D & W History',
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

interface IContext {
    query: any;
    route: any;
    pathname: string;
    params?: IRouterResult;
    next: () => IRouterResult;
}

interface IUniversalRouterItem {
    path: string | RegExp;
    action?: (ctx: IContext, params: any) => any;
    children?: Array<IUniversalRouterItem>;
}

interface IRouterResult {
    content?: React.ReactNode;
    browserTabTitle?: string;
    pageTitle?: string;
    props?: any;
    pathKey?: string;
}

export default univeralRouterArgument;
