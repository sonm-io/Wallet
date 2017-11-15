import { createHashHistory, History } from 'history';

const history: History = createHashHistory({});

(window as any)._history = history;

export { history };
