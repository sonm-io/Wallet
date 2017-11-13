import { Send } from '../components/layouts/send';
import { Wallets } from '../components/layouts/wallets';
import { App } from '../components/layouts/app';
import { History } from '../components/layouts/history';
import { Votes } from '../components/layouts/votes';
import * as React from 'react';

let defaultAction;

const routes = [
  {
    path: '/',
    async action(ctx: IContext) {
      const route = await ctx.next();

      return {
        content: (
          <App
            selectedNavMenuItem={
              ctx.pathname === '/'
                ? '/wallets'
                : ctx.pathname
            }
            {...route.props}
          >
            {route.content}
          </App>
        ),
        title: route.title,
      };
    },
    children: [
      {
        path: '/send',
        action: (ctx: IContext) => ({
          title: 'Send',
          content: <Send />,
        }),
      },
      {
        path: '/history',
        action: (ctx: IContext) => ({
          title: 'History',
          content: <History />,
        }),
      },
      {
        path: '/votes',
        action: (ctx: IContext) => ({
          title: 'Votes',
          content: <Votes />,
        }),
      },
      {
        path: '/wallets',
        action: defaultAction = (ctx: IContext) => ({
            title: 'Wallets',
            content: <Wallets />,
        }),
      },
      {
        path: /.*/,
        action: defaultAction,
      },
    ],
  },
];

interface IContext {
  query: object;
  pathname: string;
  next: () => IRouterResult;
}

interface IRouterResult {
  content: any;
  title: string;
  props?: any;
}

export { routes };
