/*eslint-env mocha */
import { supportsHistory } from '../DOMUtils'
import createBrowserHistory from '../createBrowserHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePushState from './describePushState'
import describeReplaceState from './describeReplaceState'
import describeQueries from './describeQueries'
import describeSetState from './describeSetState'
import describeGo from './describeGo'

describe('browser history', function () {
  beforeEach(function () {
    window.history.replaceState(null, null, '/')
  })

  if (supportsHistory()) {
    describeInitialLocation(createBrowserHistory)
    describeTransitions(createBrowserHistory)
    describePushState(createBrowserHistory)
    describeReplaceState(createBrowserHistory)
    describeQueries(createBrowserHistory)
    describeSetState(createBrowserHistory)
    describeGo(createBrowserHistory)
  } else {
    describe.skip(null, function () {
      describeInitialLocation(createBrowserHistory)
      describeTransitions(createBrowserHistory)
      describePushState(createBrowserHistory)
      describeReplaceState(createBrowserHistory)
      describeQueries(createBrowserHistory)
      describeSetState(createBrowserHistory)
      describeGo(createBrowserHistory)
    })
  }
})
