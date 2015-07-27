import createBrowserHistory from '../createBrowserHistory';
import describeTransitions from './describeTransitions';
import describePushState from './describePushState';
import describeReplaceState from './describeReplaceState';
import describeGo from './describeGo';

describe('browser history', function () {
  var path;
  beforeEach(function () {
    path = window.location.pathname + window.location.search;
  });

  afterEach(function () {
    window.history.replaceState(null, null, path);
  });

  describeTransitions(createBrowserHistory);
  describePushState(createBrowserHistory);
  describeReplaceState(createBrowserHistory);
  describeGo(createBrowserHistory);
});
