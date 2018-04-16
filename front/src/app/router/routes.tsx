import { Send } from 'app/components/layouts/send';
import { Wallets } from 'app/components/layouts/account-list';
import { App } from 'app/components/layouts/app';
import { History } from 'app/components/layouts/history';
import { SendSuccess } from 'app/components/layouts/send/sub/success';
import { SendConfirm } from 'app/components/layouts/send/sub/confirm';
import { Account } from 'app/components/layouts/account';
import { DepositWithdraw } from 'app/components/layouts/deposit-withdraw';
import { DepositWithdrawSuccess } from 'app/components/layouts/deposit-withdraw/sub/success';
import { DepositWithdrawConfirm } from 'app/components/layouts/deposit-withdraw/sub/confirm';
import { rootStore } from 'app/stores';
import * as React from 'react';
import { navigate } from './navigate';

let defaultAction;

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
const navigateToSend = () => navigate({ path: '/send' });
const navigateToDPSend = () => navigate({ path: '/deposit-withdraw' });
const navigateToConfirmation = () => navigate({ path: '/send/confirm' });
const navigateToSuccess = () => navigate({ path: '/send/success' });
const navigateToDPConfirmation = () =>
    navigate({ path: '/deposit-withdraw/confirm' });
const navigateToDPSuccess = () =>
    navigate({ path: '/deposit-withdraw/success' });
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

                    const content =
                        next && next.content ? (
                            next.content
                        ) : (
                            <Send
                                onNotAvailable={navigateToMain}
                                initialAddress={initialAddress}
                                initialCurrency={initialCurrency}
                                onRequireConfirmation={navigateToConfirmation}
                            />
                        );

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
                        action: (ctx: IContext) => ({
                            title: 'Success',
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
                path: '/deposit-withdraw',
                action: async (ctx: IContext, params: IUrlParams) => {
                    const initialAddress = (ctx.query as any).address;
                    const initialCurrency =
                        rootStore.mainStore.primaryTokenAddress;

                    const next = await ctx.next();

                    const content =
                        next && next.content ? (
                            next.content
                        ) : (
                            <DepositWithdraw
                                onNotAvailable={navigateToMain}
                                initialAddress={initialAddress}
                                initialCurrency={initialCurrency}
                                onRequireConfirmation={navigateToDPConfirmation}
                            />
                        );

                    if (next && next.popup) {
                        content.push(next.popup);
                    }

                    return {
                        pathKey: '/deposit-withdraw',
                        title: 'deposit-withdraw',
                        content,
                    };
                },
                children: [
                    {
                        path: '/confirm',
                        action: (ctx: IContext) => ({
                            title: 'Confirmation',
                            content: (
                                <DepositWithdrawConfirm
                                    onBack={navigateToDPSend}
                                    onSuccess={navigateToDPSuccess}
                                />
                            ),
                        }),
                    },
                    {
                        path: '/success',
                        action: (ctx: IContext) => ({
                            title: 'Success',
                            content: (
                                <DepositWithdrawSuccess
                                    onClickHistory={navigateToHistory}
                                    onClickSend={navigateToDPSend}
                                />
                            ),
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
                        content: (
                            <History
                                initialAddress={initialAddress}
                                initialCurrency={initialCurrency}
                            />
                        ),
                    };
                },
            },
            {
                path: '/accounts',
                action: (defaultAction = async (ctx: IContext) => {
                    const next = await ctx.next();

                    const content =
                        next && next.content ? next.content : <Wallets />;

                    if (next && next.popup) {
                        content.push(next.popup);
                    }

                    return {
                        pathKey: '/accounts',
                        title: 'Accounts',
                        content,
                    };
                }),
                children: [
                    {
                        path: '/:address',
                        action: (ctx: IContext, params: IUrlParams) => {
                            const initialAddress = params.address;

                            return {
                                content: (
                                    <Account initialAddress={initialAddress} />
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

export { routes };
