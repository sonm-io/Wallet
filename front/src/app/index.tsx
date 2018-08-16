import * as React from 'react';
import { render } from 'react-dom';
import * as queryStr from 'query-string';
import { history } from './router/history';
import { Login } from './components/layouts/login';
import { Wallet } from 'app/entities/wallet';
import { Provider } from 'mobx-react';
import { localizator as en } from 'app/localization';
import { RootStore } from 'app/stores';
import { getResolveMethod } from 'app/router';
import { RootStoreContext } from 'app/contexts/root-store-context';

interface ILocationParams {
    pathname: string;
    search: string;
}

class Renderer {
    protected rootStore: RootStore;
    protected resolve: any;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.resolve = getResolveMethod(rootStore);
    }

    /**
     * Renders app with state corresponding to given location
     * @param {Object} location
     */
    public async renderByPath({ pathname, search }: ILocationParams) {
        const query = queryStr.parse(search);
        const { content, browserTabTitle } = await this.resolve({
            pathname,
            query,
        });

        window.document.title = browserTabTitle;

        render(
            <Provider rootStore={this.rootStore}>
                <RootStoreContext.Provider value={this.rootStore}>
                    {content}
                </RootStoreContext.Provider>
            </Provider>,
            window.document.querySelector('#root'),
        );
    }
}

async function handleLogin(wallet: Wallet) {
    const rootStore = new RootStore(en);
    if (IS_DEV) {
        (window as any).__rootStore = rootStore;
    }
    const renderer = new Renderer(rootStore);
    history.listen(renderer.renderByPath.bind(renderer));
    await Promise.all([rootStore.wallet.init(wallet)]);
    renderer.renderByPath((history as any).location);
}

export async function run() {
    render(
        <Login onLogin={handleLogin} key="login" />,
        window.document.querySelector('#root'),
    );
}

export default run;
