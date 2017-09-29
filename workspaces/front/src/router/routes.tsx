import { App } from '../components/layouts/app';
import { Login } from '../components/layouts/login';
import * as React from 'react';

let defaultAction;

const routes = [
  {
    path: '/login',
    action: () => ({
      content: <Login />,
      title: 'Login',
    }),
  },
  {
    path: /^\//,
    async action({ next }: IContext) {
      const route = await next();

      return {
        content: (
          <App
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
        path: 'main',
        action: defaultAction = (ctx: IContext) => ({
          title: 'Main',
          content: <div>Main Page</div>,
        }),
      },
      {
        path: /.*/,
        action: () => ({
          title: 'Wrong way',
          content: <div>WRONG WAY</div>,
        }),
      },
    ],
  },
];

interface IContext {
  query: object;
  next: () => IRouterResult;
}

interface IRouterResult {
  content: any;
  title: string;
  props?: any;
}

export { routes };
