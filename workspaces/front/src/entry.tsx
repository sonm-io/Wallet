import * as React from 'react';
import { render } from 'react-dom';
import { resolve } from './router';
import { history } from './router/history';
import * as queryStr from 'query-string';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import * as api from './api';
import { navigate } from './router/navigate';

interface ILocationParams {
  pathname: string;
  search: string;
}

/**
 * Renders app with state corresponding to given location
 * @param {Object} location
 */
async function renderByPath({ pathname, search }: ILocationParams) {
  const { content, title } = await resolve({ pathname, query: queryStr.parse(search) });

  window.document.title = title;

  render(
    <Provider {...stores} api={api} navigate={navigate} key="app-root">
      {content}
    </Provider>,
    window.document.querySelector('#root'),
  );
}

const waitForLoad = new Promise(done => {
  window.addEventListener('DOMContentLoaded', done);
});

async function init() {
  await waitForLoad;
  history.listen(renderByPath);
  renderByPath({ pathname: '/login', search: '' });
}

init();
