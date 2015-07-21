import describeDOMHistory from './describeDOMHistory';
import createBrowserHistory from '../createBrowserHistory';

describe('browser history', function () {
  beforeEach(function () {
    window.history.replaceState(null, null, '/');
  });

  describeDOMHistory(createBrowserHistory);
});
