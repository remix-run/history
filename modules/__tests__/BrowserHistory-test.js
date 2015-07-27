import createBrowserHistory from '../createBrowserHistory';
import describeTransitions from './describeTransitions';
import describePushState from './describePushState';
import describeReplaceState from './describeReplaceState';
import describeGo from './describeGo';

describe('browser history', function () {
  beforeEach(function () {
    window.history.replaceState(null, null, '/');
  });

  describeTransitions(createBrowserHistory);
  describePushState(createBrowserHistory);
  describeReplaceState(createBrowserHistory);
  describeGo(createBrowserHistory);
});
