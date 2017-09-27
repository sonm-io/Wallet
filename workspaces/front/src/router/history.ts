import { createBrowserHistory, History } from 'history';

const history: History = createBrowserHistory();

(window as any)._history = history;

export { history };
