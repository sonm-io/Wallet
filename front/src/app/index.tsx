import * as React from 'react';
import { render } from 'react-dom';
import * as queryStr from 'query-string';
import { Provider } from 'mobx-react';
import { resolve } from './router';
import { history } from './router/history';
import * as stores from './stores';
import { Api } from './api/';

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

const waitForLoad = new Promise(done => {
    window.addEventListener('DOMContentLoaded', done);
});

async function init() {
    await Promise.all([waitForLoad]);
    history.listen(renderByPath);

    await Api.setSecretKey('my secret key', 'wallet1');

    try {
        await Api.addAccount(
            `{"address":"fd0c80ba15cbf19770319e5e76ae05012314608f","crypto":{"cipher":"aes-128-ctr","ciphertext":"83b9ea7c8b7f45d4d83704483a666d33b793c18a722557a1af0ea3dd84fd0e64","cipherparams":{"iv":"132e609bb81d9fff9380f828d44df738"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"18fbd1950ec1cfcd5564624152b66c09ce03df7b7b3136f019f746f12de8e8f9"},"mac":"b76158d4109241a4fd5752b06356de52152952cda78382d0cbac41650d58d64c"},"id":"d5c89177-f7c6-4da0-ac20-20b6d5f3dae1","version":3}`,
            'qazwsxedc',
            'Petya',
        );
    } catch (e) {

    }

    await Promise.all([
        stores.mainStore.init(),
        stores.historyStore.init(),
    ]);

    renderByPath((history as any).location);
}

init();
