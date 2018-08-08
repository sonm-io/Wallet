import * as React from 'react';
import { render } from 'react-dom';
import * as queryStr from 'query-string';
import { history } from './router/history';
import { Login } from './components/layouts/login';
import { IWalletListItem } from 'app/api/types';
import { Provider } from 'mobx-react';
import { localizator as en } from 'app/localization';
import { RootStore } from 'app/stores';
import { getResolveMethod } from 'app/router';

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
            <Provider rootStore={this.rootStore}>{content}</Provider>,
            window.document.querySelector('#root'),
        );
    }
}

async function handleLogin(wallet: IWalletListItem) {
    const rootStore = new RootStore(en);
    const renderer = new Renderer(rootStore);
    history.listen(renderer.renderByPath.bind(renderer));
    await Promise.all([
        rootStore.mainStore.init(),
        rootStore.walletStore.init(wallet),
        rootStore.gasPrice.init(),
        rootStore.uiStore.init(),
        rootStore.currencyStore.init(),
        rootStore.myProfilesStore.getAccountList(),
    ]);
    renderer.renderByPath((history as any).location);
}

export async function run() {
    render(
        <Login onLogin={handleLogin} key="login" />,
        window.document.querySelector('#root'),
    );
}

export default run;
