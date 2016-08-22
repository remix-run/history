import { supportsHistory } from '../DOMUtils'
import createBrowserHistory from '../createBrowserHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePushState from './describePushState'
import describePush from './describePush'
import describeReplaceState from './describeReplaceState'
import describeReplace from './describeReplace'
import describePopState from './describePopState'
import describeHashSupport from './describeHashSupport'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'
import describeUnlisten from './describeUnlisten'

describe('browser history', function () {
  beforeEach(function () {
    window.history.replaceState(null, null, '/')
  })

  if (supportsHistory()) {
    describeInitialLocation(createBrowserHistory)
    describeTransitions(createBrowserHistory)
    describePushState(createBrowserHistory)
    describePush(createBrowserHistory)
    describeReplaceState(createBrowserHistory)
    describeReplace(createBrowserHistory)
    describePopState(createBrowserHistory)
    describeHashSupport(createBrowserHistory)
    describeBasename(createBrowserHistory)
    describeQueries(createBrowserHistory)
    describeGo(createBrowserHistory)
    describeUnlisten(createBrowserHistory)
  } else {
    describe.skip(null, function () {
      describeInitialLocation(createBrowserHistory)
      describeTransitions(createBrowserHistory)
      describePushState(createBrowserHistory)
      describePush(createBrowserHistory)
      describeReplaceState(createBrowserHistory)
      describeReplace(createBrowserHistory)
      describePopState(createBrowserHistory)
      describeHashSupport(createBrowserHistory)
      describeBasename(createBrowserHistory)
      describeQueries(createBrowserHistory)
      describeGo(createBrowserHistory)
      describeUnlisten(createBrowserHistory)
    })
  }
})
