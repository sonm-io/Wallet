import * as React from 'react';
import { render } from 'react-dom';
import { resolve } from './router';
import { history } from './router/history';
import * as queryStr from 'query-string';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import { api } from 'src/api';

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
    <Provider {...stores} api={api} key="app-root">
      {content}
    </Provider>,
    window.document.querySelector('#root'),
  );
}

history.listen(renderByPath);

window.addEventListener('DOMContentLoaded', () => {
  renderByPath({ pathname: '/login', search: '' });
});
