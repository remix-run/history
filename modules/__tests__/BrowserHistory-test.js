import describeDOMHistory from './describeDOMHistory';
import createBrowserHistory from '../createBrowserHistory';

describe('browser history', function () {
  describeDOMHistory(createBrowserHistory);
});
