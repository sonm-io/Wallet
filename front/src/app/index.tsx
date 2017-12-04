import * as React from 'react';
import { render } from 'react-dom';
import * as queryStr from 'query-string';
import { Provider } from 'mobx-react';
import { resolve } from './router';
import { history } from './router/history';
import * as stores from './stores';
import { Login } from './components/layouts/login';

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
    const { content, title } = await resolve({ pathname, query });

    window.document.title = title;

    render(
        <Provider {...stores} key="app-root">
            {content}
        </Provider>,
        window.document.querySelector('#root'),
    );
}

const domLoading = new Promise(done => { window.addEventListener('DOMContentLoaded', done); });

async function handleLogin() {
    history.listen(renderByPath);

    await Promise.all([
        stores.mainStore.init(),
        stores.historyStore.init(),
    ]);

    renderByPath((history as any).location);
}

async function start() {
    await domLoading;

    render(
        <Login onLogin={handleLogin} key="login" />,
        window.document.querySelector('#root'),
    );
}

start();
