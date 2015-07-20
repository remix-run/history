import describeDOMHistory from './describeDOMHistory';
import createBrowserHistory from '../modules/createBrowserHistory';

describe('browser history', function () {
  describeDOMHistory(createBrowserHistory);
});
