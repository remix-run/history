import createBrowserHistory from '../createBrowserHistory';
import describeDOMHistory from './describeDOMHistory';

describe('browser history', function () {
  beforeEach(function () {
    window.history.replaceState(null, null, '/');
  });

  describeDOMHistory(createBrowserHistory);

  describe('when the user cancels a POP transition', function () {
    it('puts the URL back');
  });
});
