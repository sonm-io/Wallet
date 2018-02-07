import { Send } from 'app/components/layouts/send';
import { Wallets } from 'app/components/layouts/account-list';
import { App } from 'app/components/layouts/app';
import { History } from 'app/components/layouts/history';
import { SendSuccess } from 'app/components/layouts/send/sub/success';
import { SendConfirm } from 'app/components/layouts/send/sub/confirm';
import { Account } from 'app/components/layouts/account';
import * as React from 'react';
import { rootStore } from 'app/stores';

import { navigate } from './navigate';

let defaultAction;

const navigateToSend = () => navigate({ path: '/send' });
const navigateToHistory = (accountAddress: string = '', currencyAddress: string = '') => {
    navigate({
        path: '/history',
        query: accountAddress || currencyAddress ? {
            address: accountAddress,
            currency: currencyAddress,
        } : undefined,
    });
};
const navigateToConfirmation = () => navigate({ path: '/send/confirm' });
const navigateToSuccess = () => navigate({ path: '/send/success' });
const navigateToMain = () => navigate({ path: '/accounts' });
const navigateTo = (path: string) => navigate({ path });

function reload() {
    window.location.reload(true);
}

const routes = [
    {
        path: '/',
        async action(ctx: IContext) {
            const inner = await ctx.next();

            return {
                content: (
                    <App
                        rootStore={rootStore}
                        onNavigate={navigateTo}
                        onExit={reload}
                        selectedNavMenuItem={inner.pathKey}
                        {...inner.props}
                    >
                        {inner && inner.content}
                    </App>
                ),
                title: `SONM Wallet: ${inner.title}`,
            };
        },
        children: [
            {
                path: '/send',
                action: async (ctx: IContext, params: IUrlParams) => {
                    const initialAddress = (ctx.query as any).address;
                    const initialCurrency = (ctx.query as any).currency;

                    const next = await ctx.next();

                    const content = next && next.content
                        ? next.content
                        : <Send
                            onNotAvailable={navigateToMain}
                            rootStore={rootStore}
                            initialAddress={initialAddress}
                            initialCurrency={initialCurrency}
                            onRequireConfirmation={navigateToConfirmation}
                        />;

                    if (next && next.popup) {
                        content.push(next.popup);
                    }

                    return {
                        pathKey: '/send',
                        title: 'Send',
                        content,
                    };
                },
                children: [
                    {
                        path: '/confirm',
                        action: (ctx: IContext) => ({
                            title: 'Confirmation',
                            content: <SendConfirm
                                rootStore={rootStore}
                                onBack={navigateToSend}
                                onSuccess={navigateToSuccess}
                            />,
                        }),
                    },
                    {
                        path: '/success',
                        action: (ctx: IContext) => ({
                            title: 'Success',
                            content: <SendSuccess
                                onClickHistory={navigateToHistory}
                                onClickSend={navigateToSend}
                            />,
                        }),
                    },
                ],
            },
            {
                path: '/history',
                action: (ctx: IContext, params: IUrlParams) => {
                    const initialAddress = (ctx.query as any).address;
                    const initialCurrency = (ctx.query as any).currency;

                    return {
                        pathKey: '/history',
                        title: 'History',
                        content: <History
                            rootStore={rootStore}
                            initialAddress={initialAddress}
                            initialCurrency={initialCurrency}
                        />,
                    };
                },
            },
            {
                path: '/accounts',
                action: defaultAction = async (ctx: IContext) => {
                    const next = await ctx.next();

                    const content = next && next.content
                            ? next.content
                            : <Wallets rootStore={rootStore}/>;

                    if (next && next.popup) {
                        content.push(next.popup);
                    }

                    return {
                        pathKey: '/accounts',
                        title: 'Accounts',
                        content,
                    };
                },
                children: [
                    {
                        path: '/:address',
                        action: (ctx: IContext, params: IUrlParams) => {
                            const initialAddress = params.address;

                            return {
                                content: <Account
                                    initialAddress={initialAddress}
                                    rootStore={rootStore}
                                />,
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

export interface IUrlParams {
    [key: string]: string;
}

interface IContext {
    query: object;
    pathname: string;
    params?: any;
    next: () => IRouterResult;
}

interface IRouterResult {
    popup?: any;
    content?: any;
    title: string;
    props?: any;
    pathKey: string;
}

export {routes};
