import { supportsHistory } from '../DOMUtils'
import createBrowserHistory from '../createBrowserHistory'
import describeListen from './describeListen'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePush from './describePush'
import describeReplace from './describeReplace'
import describePopState from './describePopState'
import describePopStateCancel from './describePopStateCancel'
import describeHashSupport from './describeHashSupport'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('browser history', () => {
  beforeEach(() => {
    window.history.replaceState(null, null, '/')
  })

  if (supportsHistory()) {
    describeListen(createBrowserHistory)
    describeInitialLocation(createBrowserHistory)
    describeTransitions(createBrowserHistory)
    describePush(createBrowserHistory)
    describeReplace(createBrowserHistory)
    describePopState(createBrowserHistory)
    describePopStateCancel(createBrowserHistory)
    describeHashSupport(createBrowserHistory)
    describeBasename(createBrowserHistory)
    describeQueries(createBrowserHistory)
    describeGo(createBrowserHistory)
  } else {
    describe.skip(null, () => {
      describeListen(createBrowserHistory)
      describeInitialLocation(createBrowserHistory)
      describeTransitions(createBrowserHistory)
      describePush(createBrowserHistory)
      describeReplace(createBrowserHistory)
      describePopState(createBrowserHistory)
      describePopStateCancel(createBrowserHistory)
      describeHashSupport(createBrowserHistory)
      describeBasename(createBrowserHistory)
      describeQueries(createBrowserHistory)
      describeGo(createBrowserHistory)
    })
  }
})
