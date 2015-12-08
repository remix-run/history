import { supportsHistory } from '../DOMUtils'
import createBrowserHistory from '../createBrowserHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePush from './describePush'
import describeReplace from './describeReplace'
import describePop from './describePop'
import describeHashSupport from './describeHashSupport'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('browser history', function () {
  beforeEach(function () {
    window.history.replaceState(null, null, '/')
  })

  if (supportsHistory()) {
    describeInitialLocation(createBrowserHistory)
    describeTransitions(createBrowserHistory)
    describePush(createBrowserHistory)
    describeReplace(createBrowserHistory)
    describePop(createBrowserHistory)
    describeHashSupport(createBrowserHistory)
    describeBasename(createBrowserHistory)
    describeQueries(createBrowserHistory)
    describeGo(createBrowserHistory)
  } else {
    describe.skip(null, function () {
      describeInitialLocation(createBrowserHistory)
      describeTransitions(createBrowserHistory)
      describePush(createBrowserHistory)
      describeReplace(createBrowserHistory)
      describePop(createBrowserHistory)
      describeHashSupport(createBrowserHistory)
      describeBasename(createBrowserHistory)
      describeQueries(createBrowserHistory)
      describeGo(createBrowserHistory)
    })
  }
})
