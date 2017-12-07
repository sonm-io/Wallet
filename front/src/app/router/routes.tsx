import { Send } from '../components/layouts/send';
import { Wallets } from '../components/layouts/wallets';
import { App } from '../components/layouts/app';
import { History } from '../components/layouts/history';
import { Votes } from '../components/layouts/votes';
import { SendSuccess } from '../components/layouts/send/sub/success';
import { Account } from '../components/layouts/account';
import * as React from 'react';

import { LocaleProvider } from 'antd';
import * as enUS from 'antd/lib/locale-provider/en_US';
import { navigate } from './navigate';
const enUSLocale: any = enUS;

let defaultAction;

const navigateToSend = () => navigate({ path: '/send' });
const navigateToHistory = () => navigate({ path: '/history' });

const routes = [
    {
        path: '/',
        async action(ctx: IContext) {
            const inner = await ctx.next();

            return {
                content: (
                    <LocaleProvider locale={enUSLocale}>
                        <App
                            selectedNavMenuItem={ctx.pathname}
                            {...inner.props}
                        >
                            {inner && inner.content}
                        </App>
                    </LocaleProvider>
                ),
                title: inner.title,
            };
        },
        children: [
            {
                path: '/oh-yes',
                action: (ctx: IContext, params: IUrlParams) => ({
                    title: 'Sending complete',
                    content: <SendSuccess
                        onClickSend={navigateToSend}
                        onClickHistory={navigateToHistory}
                    />,
                }),
            },
            {
                path: '/send',
                action: (ctx: IContext, params: IUrlParams) => {
                    const initialAddress = (ctx.query as any).address;
                    const initialCurrency = (ctx.query as any).currency;

                    return {
                        title: 'Send',
                        content: <Send {...{ initialAddress, initialCurrency }} />,
                    };
                },
            },
            {
                path: '/history',
                action: (ctx: IContext, params: IUrlParams) => {
                    const initialAddress = (ctx.query as any).address;
                    const initialCurrency = (ctx.query as any).currency;

                    return {
                        title: 'History',
                        content: <History {...{ initialAddress, initialCurrency }} />,
                    };
                },
            },
            {
                path: '/votes',
                action: (ctx: IContext) => ({
                    title: 'Votes',
                    content: <Votes/>,
                }),
            },
            {
                path: '/account',
                action: (ctx: IContext) => {
                    const initialAddress = (ctx.query as any).address;

                    return {
                        title: 'Account',
                        content: <Account {...{ initialAddress }} />,
                    };
                },
            },
            {
                path: '/accounts',
                action: defaultAction = async (ctx: IContext) => {
                    const inner = await ctx.next();

                    return {
                        title: 'Accounts',
                        content: (
                            <Wallets>
                                {inner && inner.content}
                            </Wallets>
                        ),
                    };
                },
                children: [
                    {
                        path: '/add',
                        action: (ctx: IContext) => ({
                            content: 'Add',
                        }),
                    },
                    {
                        path: '/delete/:address',
                        action: (ctx: IContext, params: IUrlParams) => ({
                            content: 'Delete ' + JSON.stringify(params),
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
    content: any;
    title: string;
    props?: any;
}

export {routes};
