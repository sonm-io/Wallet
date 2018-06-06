import * as React from 'react';
import { TFnAction, IRouterResult, IContext } from './types';

export function reload() {
    window.location.reload(true);
}

export function replaceWithChild(action: TFnAction): TFnAction {
    return async (ctx: IContext, p: any): Promise<IRouterResult> => {
        const child: IRouterResult = await ctx.next();

        if (child) {
            return child;
        } else {
            return action(ctx, p);
        }
    };
}

export function appendChild(action: TFnAction): TFnAction {
    return async (ctx: IContext, p: any): Promise<IRouterResult> => {
        const [me, child] = await Promise.all([action(ctx, p), ctx.next()]);

        return {
            content: (
                <React.Fragment>
                    {me.content}
                    {child ? child.content : null}
                </React.Fragment>
            ),
            browserTabTitle: child ? child.browserTabTitle : me.browserTabTitle,
            pageTitle: child ? child.pageTitle : me.pageTitle,
        };
    };
}

export async function firstByDefault(ctx: IContext, p: any) {
    const params: IRouterResult = await ctx.next();

    return params ? params : ctx.route.children[0].action(ctx, p);
}
