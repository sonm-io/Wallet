import * as React from 'react';
import { render } from 'react-dom';
import { resolve } from './router';
import { history } from './router/history';
import * as queryStr from 'query-string';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import { api } from './api';

interface ILocationParams {
  pathname: string;
  search: string;
}

let privateKey: string;

/**
 * Renders app with state corresponding to given location
 * @param {Object} location
 */
async function renderByPath({ pathname, search }: ILocationParams) {
  const { content, title } = await resolve({ pathname, query: queryStr.parse(search) });

  window.document.title = title;

  render(
    <Provider {...stores} api={api} privateKey={privateKey} key="app-root">
      {content}
    </Provider>,
    window.document.querySelector('#root'),
  );
}

const waitForKeys = api.readPrivateKey().then(x => privateKey = x);
const waitForLoad = new Promise(done => {
  window.addEventListener('DOMContentLoaded', done);
});

async function init() {
  await Promise.all([waitForKeys, waitForLoad]);
  history.listen(renderByPath);
  renderByPath({ pathname: '/login', search: '' });
}

init();
