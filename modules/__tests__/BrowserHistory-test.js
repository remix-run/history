import createBrowserHistory from '../createBrowserHistory';
import describeDOMHistory from './describeDOMHistory';

describe('browser history', function () {
  var path;
  beforeEach(function () {
    path = window.location.pathname + window.location.search;
  });

  afterEach(function () {
    window.history.replaceState(null, null, path);
  });

  describeDOMHistory(createBrowserHistory);

  describe('when the user cancels a POP transition', function () {
    it('puts the URL back');
  });
});
