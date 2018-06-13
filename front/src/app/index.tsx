import * as React from 'react';
import { render } from 'react-dom';
import * as queryStr from 'query-string';
import { resolve } from './router';
import { history } from './router/history';
import { rootStore } from './stores';
import { Login } from './components/layouts/login';
import { IWalletListItem } from 'app/api/types';

interface ILocationParams {
    pathname: string;
    search: string;
}

/**
 * Renders app with state corresponding to given location
 * @param {Object} location
 */
async function renderByPath({ pathname, search }: ILocationParams) {
    const query = queryStr.parse(search);
    const { content, browserTabTitle } = await resolve({ pathname, query });

    window.document.title = browserTabTitle;

    render(content, window.document.querySelector('#root'));
}

async function handleLogin(wallet: IWalletListItem) {
    history.listen(renderByPath);

    await Promise.all([
        rootStore.mainStore.init(wallet),
        // rootStore.historyStore.init(), ToDo a
        // rootStore.dwHistoryStore.init(),
    ]);

    renderByPath((history as any).location);
}

export async function run() {
    render(
        <Login onLogin={handleLogin} key="login" />,
        window.document.querySelector('#root'),
    );
}

export default run;
