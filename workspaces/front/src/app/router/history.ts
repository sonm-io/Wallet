import { createMemoryHistory, History } from 'history';

const history: History = createMemoryHistory({
  initialEntries: [ '/main' ],
  initialIndex: 0,
});

(window as any)._history = history;

export { history };
